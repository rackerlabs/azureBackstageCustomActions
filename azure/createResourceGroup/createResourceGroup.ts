import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';
import { ClientSecretCredential } from '@azure/identity';
import { ResourceManagementClient } from "@azure/arm-resources";

async function createResourceGroup(ctx: any, tenantId: string, clientId: string, clientSecret: string, subscriptionId: string, resourceGroupName: string, location: string): Promise<{ id: string }> {
  const logger = ctx.logger;
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

  const resourceClient = new ResourceManagementClient(credential, subscriptionId);

  const groupParameters = {
    location: location
  };

  try {
    // Create resource group
    const resourceGroup = await resourceClient.resourceGroups.createOrUpdate(resourceGroupName, groupParameters);
    const id = resourceGroup.id

    if (!id) {
      throw new Error("Resource group ID is undefined.");
    }

    logger.info(`Resource group created successfully: ${resourceGroup.name}`);
    return { id }

  } catch (error) {
    logger.error(`Error creating resource group: ${error}`);
    throw error; // You might want to rethrow the error to handle it appropriately in the calling function
  }
}


export function createResourceGroupAction() {
  return createTemplateAction<{
    tenantId: string;
    clientId: string;
    clientSecret: string;
    subscriptionId: string;
    resourceGroupName: string;
    location: string;
  }>({
    id: 'azure:create-resourcegroup',
    schema: {
      input: {
        type: 'object',
        required: ['tenantId', 'clientId', 'clientSecret', 'subscriptionId', 'resourceGroupName', 'location'],
        properties: {

          tenantId: inputProps.tenantId,
          clientId: inputProps.clientId,
          clientSecret: inputProps.clientSecret,
          subscriptionId: inputProps.subscriptionId,
          resourceGroupName: inputProps.resourceGroupName,
          location: inputProps.location,
        },
      },
      output: {
        type: 'object',
        properties: {
          success: outputProps.success,
          id: outputProps.id,
        },
      },
    },
    async handler(ctx: any) {
      try {
        const { tenantId, clientId, clientSecret, subscriptionId, resourceGroupName, location } = ctx.input;

        const { id } = await createResourceGroup(ctx, tenantId, clientId, clientSecret, subscriptionId, resourceGroupName, location)
        ctx.output('id', id);
      } catch (error: any) {
        ctx.logger.error(`[ERROR] - ${error.message}`);
        throw new Error(`Failed to create Resource Group: ${error.message}`);
      }
    },
  });
}
