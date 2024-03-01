import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';
import { ClientSecretCredential } from '@azure/identity';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { Client } from '@microsoft/microsoft-graph-client';

async function createFederatedCredential(ctx: any, issuer: string, subject: string, appObjId: string, tenantId: string, clientId: string, clientSecret: string) {
  const logger = ctx.logger;
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
  });

  const graphClient = Client.initWithMiddleware({ authProvider });

  const federatedIdentityCredential = {
    name: encodeURIComponent(subject),
    issuer: issuer,
    subject: subject,
    audiences: [
      'api://AzureADTokenExchange'
    ]
  };

  const url = `/applications/${appObjId}/federatedIdentityCredentials/`

  await graphClient.api(url)
    .post(federatedIdentityCredential);

  logger.info(`Succesfully Created Federated Credential with subject ${subject}`);

}

export function createFederatedCredentialAction() {
  return createTemplateAction<{
    appObjId: string;
    issuer: string;
    subject: string;
    tenantId: string;
    clientId: string;
    clientSecret: string;
  }>({
    id: 'azure:create-fedcred',
    schema: {
      input: {
        type: 'object',
        required: ['appObjId', 'issuer', 'subject', 'tenantId', 'clientId', 'clientSecret'],
        properties: {
          appObjId: inputProps.appObjId,
          issuer: inputProps.issuer,
          subject: inputProps.subject,
          tenantId: inputProps.tenantId,
          clientId: inputProps.clientId,
          clientSecret: inputProps.clientSecret,
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
        const { appObjId, issuer, subject, tenantId, clientId, clientSecret } = ctx.input;

        await createFederatedCredential(ctx, issuer, subject, appObjId, tenantId, clientId, clientSecret)

      } catch (error: any) {
        ctx.logger.error(`[ERROR] - ${error.message}`);
        throw new Error(`Failed to create Federated Credential: ${error.message}`);
      }
    },
  });
}

