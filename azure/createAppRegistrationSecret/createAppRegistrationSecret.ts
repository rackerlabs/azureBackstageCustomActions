import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';
import { ClientSecretCredential } from '@azure/identity';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { Client } from '@microsoft/microsoft-graph-client';

async function createAppRegistrationSecret(ctx: any, appObjId: string, tenantId: string, clientId: string, clientSecret: string) {
  const logger = ctx.logger;
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
  });

  const graphClient = Client.initWithMiddleware({ authProvider });

  const passwordCredential = {
    passwordCredential: {
      displayName: 'Created by Backstage'
    }
  };

  const result = await graphClient.api(`/applications/${appObjId}/addPassword`)
    .post(passwordCredential);

  const secret = result.secretText
  logger.info(`Succesfully Created Secret`);

  return secret;

}


export function createAppRegistrationSecretAction() {
  return createTemplateAction<{
    appObjId: string;
    tenantId: string;
    clientId: string;
    clientSecret: string;
  }>({
    id: 'azure:create-appreg-secret',
    schema: {
      input: {
        type: 'object',
        required: ['appObjId', 'tenantId', 'clientId', 'clientSecret'],
        properties: {
          appObjId: inputProps.appObjId,
          tenantId: inputProps.tenantId,
          clientId: inputProps.clientId,
          clientSecret: inputProps.clientSecret,
        },
      },
      output: {
        type: 'object',
        properties: {
          secret: outputProps.secret,
          success: outputProps.success,
        },
      },
    },
    async handler(ctx: any) {
      try {
        const { appObjId, tenantId, clientId, clientSecret } = ctx.input;

        const secret = await createAppRegistrationSecret(ctx, appObjId, tenantId, clientId, clientSecret);
        ctx.output('secret', secret);

      } catch (error: any) {
        ctx.logger.error(`[ERROR] - ${error.message}`);
        throw new Error(`Failed to create App Reg Secret: ${error.message}`);
      }
    },
  });
}


