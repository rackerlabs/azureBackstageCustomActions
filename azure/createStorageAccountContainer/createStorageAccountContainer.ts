import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';
import { BlobServiceClient } from '@azure/storage-blob';
import { ClientSecretCredential } from '@azure/identity';
import dns from 'dns';

async function isDnsResolved(hostname : string, maxRetries = 6, delay = 10000) {
  let currentAttempt = 0;

  while (currentAttempt < maxRetries) {
    try {
      return await new Promise((resolve, reject) => {
        dns.resolve(hostname, (error, addresses) => {
          if (error) {
            reject(error);
          } else {
            resolve(addresses);
          }
        });
      });
    } catch (error) {
      currentAttempt++;
      if (currentAttempt < maxRetries) {
        // Retry after a delay
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Throw the last encountered error if max retries reached
      }
    }
  }

  // If all retries fail, throw an error indicating DNS resolution failure
  throw new Error(`DNS resolution for '${hostname}' failed after ${maxRetries} attempts.`);
}


async function createStorageAccountContainer(ctx: any, tenantId: string, clientId: string, clientSecret: string, storageAccountName: string, containerName: string) {
  const logger = ctx.logger;

  try {
    // Check DNS resolution for the storage account URL with retries
    await isDnsResolved(`${storageAccountName}.blob.core.windows.net`);

    // Create a ClientSecretCredential object using tenantId, clientId, and clientSecret
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

    // Create a BlobServiceClient object using the storage account URL and the credential created
    const blobServiceClient = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net`, credential);

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create the container
    await containerClient.create();
    logger.info(`Container '${containerName}' created successfully in storage account '${storageAccountName}'.`);

  } catch (error) {
    logger.error(`Error creating container '${containerName}' in storage account '${storageAccountName}': ${error}`);
    throw error;
  }
}

export function createStorageAccountContainerAction() {
  return createTemplateAction<{
    tenantId: string;
    clientId: string;
    clientSecret: string;
    storageAccountName: string;
    containerName: string;
  }>({
    id: 'azure:create-storage-account-container',
    schema: {
      input: {
        type: 'object',
        required: ['tenantId', 'clientId', 'clientSecret', 'storageAccountName', 'containerName'],
        properties: {
          tenantId: inputProps.tenantId,
          clientId: inputProps.clientId,
          clientSecret: inputProps.clientSecret,
          storageAccountName: inputProps.storageAccountName,
          containerName: inputProps.containerName,
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
        const { tenantId, clientId, clientSecret, storageAccountName, containerName } = ctx.input;

        await createStorageAccountContainer(ctx, tenantId, clientId, clientSecret, storageAccountName, containerName);

      } catch (error: any) {
        ctx.logger.error(`[ERROR] - ${error.message}`);
        throw new Error(`Failed to create storage account container: ${error.message}`);
      }
    },
  });
}
