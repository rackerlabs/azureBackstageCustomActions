import { DateTime } from 'luxon';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';
import { ClientSecretCredential } from '@azure/identity';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { Client } from '@microsoft/microsoft-graph-client';

async function createAppRegistrationSecret(
  ctx: any,
  appObjId: string,
  tenantId: string,
  clientId: string,
  clientSecret: string,
  validityDays?: number 
) {
  const logger = ctx.logger;
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
  });

  const graphClient = Client.initWithMiddleware({ authProvider });

  const passwordCredential = {
    passwordCredential: {
      displayName: 'Created by Backstage',
      // If validityDays is defined, calculate expiryDate
      ...(validityDays && { endDateTime: DateTime.now().plus({ days: validityDays }).toJSDate().toISOString() }),
    },
  };

  const result = await graphClient.api(`/applications/${appObjId}/addPassword`)
    .post(passwordCredential);

  const secret = result.secretText;
  const endDate = result.endDateTime; // Extracting the end date from the response
  logger.info(`Successfully Created Secret with end date: ${endDate}`); // Logging the end date

  return { secret, endDate }; // Returning both secret and end date
}

export function createAppRegistrationSecretAction() {
  return createTemplateAction<{
    appObjId: string;
    tenantId: string;
    clientId: string;
    clientSecret: string;
    validityDays?: number;
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
          validityDays: inputProps.validityDays,
        },
      },
      output: {
        type: 'object',
        properties: {
          secret: outputProps.secret,
          endDate: outputProps.endDate,
          success: outputProps.success,
        },
      },
    },
    async handler(ctx: any) {
      try {
        const { appObjId, tenantId, clientId, clientSecret, validityDays } = ctx.input;

        const { secret, endDate } = await createAppRegistrationSecret(ctx, appObjId, tenantId, clientId, clientSecret, validityDays);
        ctx.output('secret', secret);
        ctx.output('endDate', endDate); // Passing end date to the output

      } catch (error: any) {
        ctx.logger.error(`[ERROR] - ${error.message}`);
        throw new Error(`Failed to create App Reg Secret: ${error.message}`);
      }
    },
  });
}
