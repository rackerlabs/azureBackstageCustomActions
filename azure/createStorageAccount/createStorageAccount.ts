import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';
import { ClientSecretCredential } from '@azure/identity';
import { StorageManagementClient } from '@azure/arm-storage';


async function createStorageAccount(ctx: any, tenantId: string, clientId: string, clientSecret: string, subscriptionId: string, resourceGroupName: string, storageAccountName: string, location: string) {
  const logger = ctx.logger;
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

  const storageClient = new StorageManagementClient(credential, subscriptionId);

  const params = {
    sku: {
      name: 'Standard_LRS' // Change as needed, this is an example
    },
    kind: 'StorageV2'
  };

  try {
    // Create storage account
    const operation = await storageClient.storageAccounts.beginCreateAndWait(resourceGroupName, storageAccountName, { ...params, location });

    logger.info(`Storage account ${storageAccountName} created successfully: ${operation.id}`);
    //  return { id };

  } catch (error) {
    logger.error(`Error creating storage account: ${error}`);
    throw error;
  }
}


export function createStorageAccountAction() {
  return createTemplateAction<{
    tenantId: string;
    clientId: string;
    clientSecret: string;
    subscriptionId: string;
    resourceGroupName: string;
    storageAccountName: string;
    location: string;
  }>({
    id: 'azure:create-storage-account',
    schema: {
      input: {
        type: 'object',
        required: ['tenantId', 'clientId', 'clientSecret', 'subscriptionId', 'resourceGroupName', 'storageAccountName', 'location'],
        properties: {
          tenantId: inputProps.tenantId,
          clientId: inputProps.clientId,
          clientSecret: inputProps.clientSecret,
          subscriptionId: inputProps.subscriptionId,
          resourceGroupName: inputProps.resourceGroupName,
          storageAccountName: inputProps.storageAccountName,
          location: inputProps.location,
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
        const { tenantId, clientId, clientSecret, subscriptionId, resourceGroupName, storageAccountName, location } = ctx.input;

        createStorageAccount(ctx, tenantId, clientId, clientSecret, subscriptionId, resourceGroupName, storageAccountName, location);

      } catch (error: any) {
        ctx.logger.error(`[ERROR] - ${error.message}`);
        throw new Error(`Failed to create storage account: ${error.message}`);
      }
    },
  });
}
