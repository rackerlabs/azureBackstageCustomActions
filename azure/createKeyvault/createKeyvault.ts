import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';
import { ClientSecretCredential } from '@azure/identity';
import { KeyVaultManagementClient, VaultCreateOrUpdateParameters } from '@azure/arm-keyvault';

async function createKeyVault(ctx: any, keyVaultName: string, clientId: string, clientSecret: string, subscriptionId: string, resourceGroupName: string, location: string, tenantId: string, appId: string) {
  // Create a logger
  const logger = ctx.logger;

  // Create a credential object using client secret
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

  // Initialize KeyVaultManagementClient with the credential
  const keyVaultClient = new KeyVaultManagementClient(credential, subscriptionId);

  // Create Key Vault parameters
  const parameters: VaultCreateOrUpdateParameters = {
    location: location,
    properties: {
      sku: {
        family: 'A',
        name: 'standard'
      },
      tenantId: tenantId,
      accessPolicies: [
        {
          tenantId: tenantId,
          objectId: appId,
          permissions: {
            keys: [
              "encrypt",
              "decrypt",
              "wrapKey",
              "unwrapKey",
              "sign",
              "verify",
              "get",
              "list",
              "create",
              "update",
              "import",
              "delete",
              "backup",
              "restore",
              "recover",
              "purge",
            ],
            secrets: [
              "get",
              "list",
              "set",
              "delete",
              "backup",
              "restore",
              "recover",
              "purge",
            ],
            certificates: [
              "get",
              "list",
              "delete",
              "create",
              "import",
              "update",
              "managecontacts",
              "getissuers",
              "listissuers",
              "setissuers",
              "deleteissuers",
              "manageissuers",
              "recover",
              "purge",
            ],
          },
        },
      ],
      enabledForDeployment: true,
      enabledForDiskEncryption: true,
      enabledForTemplateDeployment: true,
    }
  };

  // Create Key Vault
  const keyVault = await keyVaultClient.vaults.beginCreateOrUpdateAndWait(resourceGroupName, keyVaultName, parameters);

  // Log success message
  logger.info(`Key Vault '${keyVaultName}' created successfully.`);

  // Return the ID and URI of the created Key Vault
  return {
    id: keyVault.id,
    uri: keyVault.properties.vaultUri
  };
}

export function createKeyVaultAction() {
  return createTemplateAction<{
    keyVaultName: string;
    clientId: string;
    clientSecret: string;
    subscriptionId: string;
    resourceGroupName: string;
    location: string;
    tenantId: string;
    appId: string;
  }>({
    id: 'azure:create-keyvault',
    schema: {
      input: {
        type: 'object',
        required: ['keyVaultName', 'clientId', 'clientSecret', 'subscriptionId', 'resourceGroupName', 'location', 'tenantId'],
        properties: {
          keyVaultName: inputProps.keyVaultName,
          clientId: inputProps.clientId,
          clientSecret: inputProps.clientSecret,
          subscriptionId: inputProps.subscriptionId,
          resourceGroupName: inputProps.resourceGroupName,
          location: inputProps.location,
          tenantId: inputProps.tenantId,
          appId: inputProps.appId,
        },
      },
      output: {
        type: 'object',
        properties: {
          success: outputProps.success,
          keyVaultId: outputProps.keyVaultId,
          keyVaultUri: outputProps.keyVaultUri,
        },
      },
    },
    async handler(ctx: any) {
      try {
        const { keyVaultName, clientId, clientSecret, subscriptionId, resourceGroupName, location, tenantId, appId } = ctx.input;

        // Create Key Vault
        const keyVaultInfo = await createKeyVault(ctx, keyVaultName, clientId, clientSecret, subscriptionId, resourceGroupName, location, tenantId, appId);

        // Output success, Key Vault ID, and URI
        ctx.output('success', true);
        ctx.output('keyVaultId', keyVaultInfo.id);
        ctx.output('keyVaultUri', keyVaultInfo.uri);

      } catch (error: any) {
        ctx.logger.error(`[ERROR] - ${error.message}`);
        throw new Error(`Failed to create Key Vault: ${error.message}`);
      }
    },
  });
}
