import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';
import { ClientSecretCredential } from '@azure/identity';
import { AuthorizationManagementClient } from '@azure/arm-authorization';
import { v4 as uuidv4 } from 'uuid'; // Importing a UUID generator library

async function grantAccessToStorageAccount(ctx: any, tenantId: string, clientId: string, clientSecret: string, subscriptionId: string, resourceGroupName: string, storageAccountName: string, roleDefinitionName: string, appId: string) {
  const logger = ctx.logger;
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const authorizationClient = new AuthorizationManagementClient(credential, subscriptionId);

  try {
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
      principalId: appId,
      roleDefinitionId: roleDefinitionId,
      principalType: 'ServicePrincipal'
    };

    // Constructing the scope for the role assignment
    const scope = `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Storage/storageAccounts/${storageAccountName}`;

    // Grant access to storage account at the storage account scope
    await authorizationClient.roleAssignments.create(scope, roleAssignmentName, roleAssignmentParams);

    logger.info(`Granted access to storage account ${storageAccountName} for App ID ${appId} with role definition ${roleDefinitionName}`);

  } catch (error) {
    logger.error(`Error granting access to storage account: ${error}`);
    throw error;
  }
}


export function grantAccessToStorageAccountAction() {
  return createTemplateAction<{
    tenantId: string;
    clientId: string;
    clientSecret: string;
    subscriptionId: string;
    resourceGroupName: string;
    storageAccountName: string;
    roleDefinitionName: string;
    appId: string;
  }>({
    id: 'azure:grant-access-to-storage-account',
    schema: {
      input: {
        type: 'object',
        required: ['tenantId', 'clientId', 'clientSecret', 'subscriptionId', 'resourceGroupName', 'storageAccountName', 'roleDefinitionName', 'appId'],
        properties: {
          tenantId: inputProps.tenantId,
          clientId: inputProps.clientId,
          clientSecret: inputProps.clientSecret,
          subscriptionId: inputProps.subscriptionId,
          resourceGroupName: inputProps.resourceGroupName,
          storageAccountName: inputProps.storageAccountName,
          roleDefinitionName: inputProps.roleDefinitionName,
          appId: inputProps.appId,
        },
      },
      output: {
        type: 'object',
        properties: {
          success: outputProps.success,
        },
      },
    },
    async handler(ctx: any) {
      try {
        const { tenantId, clientId, clientSecret, subscriptionId, resourceGroupName, storageAccountName, roleDefinitionName, appId } = ctx.input;

        await grantAccessToStorageAccount(ctx, tenantId, clientId, clientSecret, subscriptionId, resourceGroupName, storageAccountName, roleDefinitionName, appId);

      } catch (error: any) {
        ctx.logger.error(`[ERROR] - ${error.message}`);
        throw new Error(`Failed to grant access to storage account: ${error.message}`);
      }
    },
  });
}
