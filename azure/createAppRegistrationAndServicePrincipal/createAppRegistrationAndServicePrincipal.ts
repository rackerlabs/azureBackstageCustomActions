import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';
import { ClientSecretCredential } from '@azure/identity';
import { AuthorizationManagementClient } from '@azure/arm-authorization';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { Client } from '@microsoft/microsoft-graph-client';
import { v4 as uuidv4 } from 'uuid';

async function createAppRegistrationAndServicePrincipal(ctx: any, appName: string, tenantId: string, clientId: string, clientSecret: string) {
  const logger = ctx.logger;
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
  });

  const graphClient = Client.initWithMiddleware({ authProvider });

  // Define the application object
  const application = {
    displayName: appName,
  };

  // Use the graphClient to create the app registration
  const createdApp = await graphClient.api('/applications').post(application);

  // Extract the appId from the created app
  const appId = createdApp.appId;

  // Extract the objectId from the created app
  const appObjId = createdApp.id

  // Create a service principal for the application
  const createdServicePrincipal = await graphClient.api(`/servicePrincipals`).post({
    appId: appId,
  });
  
  // Extract the service principal objectId
  const servicePrincipalId = createdServicePrincipal.id;
  
  // Logs
  logger.info(`Succesfully Created ${appName}`);
  logger.info(`applicationId: ${appId}`);
  logger.info(`applicationObjectId: ${appObjId}`);
  logger.info(`servicePrincipalId ${servicePrincipalId}`);

  return { appId, appObjId, servicePrincipalId };
}

async function assignRoleToServicePrincipal(tenantId: string, clientId: string, clientSecret: string, subscriptionId: string, servicePrincipalId: string, roleDefinitionName: string) {
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const authorizationClient = new AuthorizationManagementClient(credential, subscriptionId);

  // Get the role definition ID based on its name
  const resArray: any[] = [];
  for await (const item of authorizationClient.roleDefinitions.list(`subscriptions/${subscriptionId}`)) {
    resArray.push(item);
  }

  const matchingRoleDefinition = resArray.find(rd => rd.roleName === roleDefinitionName);

  if (!matchingRoleDefinition) {
    throw new Error(`Role definition with name '${roleDefinitionName}' not found.`);
  }

  const roleDefinitionId = matchingRoleDefinition.id;

  const roleAssignmentName = uuidv4(); // Generate a GUID for role assignment name

  // Define role assignment parameters
  const roleAssignmentParams = {
    principalId: servicePrincipalId,
    roleDefinitionId: roleDefinitionId,
    principalType: 'ServicePrincipal'
  };

  // Create the role assignment
  return await authorizationClient.roleAssignments.create(`/subscriptions/${subscriptionId}`, roleAssignmentName, roleAssignmentParams);
}

export function createAppRegistrationAndServicePrincipalAction() {
  return createTemplateAction<{
    appName: string;
    tenantId: string;
    clientId: string;
    clientSecret: string;
    subscriptionId: string;
    roleDefinitionNames?: string[]; // Modified to accept an array of role definition names
  }>({
    id: 'azure:create-appreg-sp',
    schema: {
      input: {
        type: 'object',
        required: ['appName', 'tenantId', 'clientId', 'clientSecret', 'subscriptionId'],
        properties: {
          appName: inputProps.appName,
          tenantId: inputProps.tenantId,
          clientId: inputProps.clientId,
          clientSecret: inputProps.clientSecret,
          subscriptionId: inputProps.subscriptionId,
          roleDefinitionNames: inputProps.roleDefinitionNames // Modified to accept an array of role definition names
        },
      },
      output: {
        type: 'object',
        properties: {
          success: outputProps.success,
          appId: outputProps.appId,
          appObjId: outputProps.appObjId,
          servicePrincipalId: outputProps.servicePrincipalId,
        },
      },
    },
    async handler(ctx: any) {
      try {
        const { appName, tenantId, clientId, clientSecret, subscriptionId, roleDefinitionNames } = ctx.input;

        // Call function to create Azure app registration and service principal
        const { appId, appObjId, servicePrincipalId } = await createAppRegistrationAndServicePrincipal(ctx, appName, tenantId, clientId, clientSecret);

        // Log success output
        ctx.output(outputProps.success.title, 'true');
        ctx.output('appId', appId);
        ctx.output('servicePrincipalId', servicePrincipalId);
        ctx.output('appObjId', appObjId);

        // If roleDefinitionNames are provided, assign each role to service principal
        if (roleDefinitionNames && roleDefinitionNames.length > 0) {
          for (const roleDefinitionName of roleDefinitionNames) {
            await assignRoleToServicePrincipal(tenantId, clientId, clientSecret, subscriptionId, servicePrincipalId, roleDefinitionName);
          }
        }

        //return { appId, servicePrincipalId };
      } catch (error: any) {
        ctx.logger.error(`[ERROR] - ${error.message}`);
        throw new Error(`Failed to create Azure app registration and service principal: ${error.message}`);
      }
    },
  });
}

