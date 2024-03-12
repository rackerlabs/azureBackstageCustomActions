import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';
import { SecretClient } from '@azure/keyvault-secrets';
import { ClientSecretCredential } from '@azure/identity';

async function createKeyVaultSecret(ctx: any, keyVaultUri: string, clientId: string, clientSecret: string, tenantId: string, secretName: string, secretValue: string) {
    // Create a logger
    const logger = ctx.logger;
    // Create a secret client
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const secretClient = new SecretClient(keyVaultUri, credential);

    // Set the secret value
    await secretClient.setSecret(secretName, secretValue);

    // Log success message
    logger.info(`Secret '${secretName}' added to Key Vault.`);

    // Return the URI of the added secret
    return `${keyVaultUri}/secrets/${secretName}`;
}

export function createKeyVaultSecretAction() {
    return createTemplateAction<{
        keyVaultUri: string;
        clientId: string;
        clientSecret: string;
        tenantId: string;
        secretName: string;
        secretValue: string;
    }>({
        id: 'azure:create-keyvault-secret',
        schema: {
            input: {
                type: 'object',
                required: ['keyVaultUri', 'clientId', 'clientSecret', 'tenantId', 'secretName', 'secretValue'],
                properties: {
                    keyVaultUri: inputProps.keyVaultUri,
                    clientId: inputProps.clientId,
                    clientSecret: inputProps.clientSecret,
                    tenantId: inputProps.tenantId,
                    secretName: inputProps.secretName,
                    secretValue: inputProps.secretValue,
                },
            },
            output: {
                type: 'object',
                properties: {
                    secretUri: outputProps.secretUri,
                    success: outputProps.success,
                },
            },
        },
        async handler(ctx: any) {
            try {
                const { keyVaultUri, clientId, clientSecret, tenantId, secretName, secretValue } = ctx.input;

                // Add secret to Key Vault
                const secretUri = await createKeyVaultSecret(ctx, keyVaultUri, clientId, clientSecret, tenantId, secretName, secretValue);

                // Output success and secret URI
                ctx.output('success', true);
                ctx.output('secretUri', secretUri);

            } catch (error: any) {
                ctx.logger.error(`[ERROR] - ${error.message}`);
                throw new Error(`Failed to add secret to Key Vault: ${error.message}`);
            }
        },
    });
}
