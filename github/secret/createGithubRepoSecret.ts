import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';
import { Octokit } from '@octokit/rest';
import Sodium from 'libsodium-wrappers';

async function addSecretsToGitHubRepository(ctx: any, client: Octokit, repository: string, owner: string, secrets: { [key: string]: string }) {
  const logger = ctx.logger;

  try {
    // If secrets are provided, add them
    if (secrets) {
      const publicKeyResponse = await client.rest.actions.getRepoPublicKey({
        owner: owner,
        repo: repository,
      });

      await Sodium.ready;
      const binaryKey = Sodium.from_base64(
        publicKeyResponse.data.key,
        Sodium.base64_variants.ORIGINAL,
      );
      for (const [key, value] of Object.entries(secrets)) {
        const binarySecret = Sodium.from_string(value);
        const encryptedBinarySecret = Sodium.crypto_box_seal(
          binarySecret,
          binaryKey,
        );
        const encryptedBase64Secret = Sodium.to_base64(
          encryptedBinarySecret,
          Sodium.base64_variants.ORIGINAL,
        );

        await client.rest.actions.createOrUpdateRepoSecret({
          owner: owner,
          repo: repository,
          secret_name: key,
          encrypted_value: encryptedBase64Secret,
          key_id: publicKeyResponse.data.key_id,
        });
      }
    }

    // Log success output
    ctx.output(outputProps.success.title, 'true');
  } catch (error : any) {
    // Handle errors
    logger.error(`Failed to add secrets to repository: ${error.message}`);
    throw new Error(`Failed to add secrets to repository: ${error.message}`);
  }
}

export function addSecretsToGitHubRepositoryAction() {
  return createTemplateAction<{
    token: string;
    repository: string;
    owner: string;
    secrets: { [key: string]: string };
  }>({
    id: 'github:add-secrets',
    schema: {
      input: {
        type: 'object',
        required: ['token', 'repository', 'owner', 'secrets'],
        properties: {
          token: inputProps.token,
          repository: inputProps.repository,
          owner: inputProps.owner,
          secrets: inputProps.secrets,
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
        const { token, repository, owner, secrets } = ctx.input;

        // Initialize Octokit client
        const client = new Octokit({ auth: token });

        // Call function to add secrets to GitHub repository
        await addSecretsToGitHubRepository(ctx, client, repository, owner, secrets);

        // Log success output
        ctx.output(outputProps.success.title, 'true');
      } catch (error: any) {
        ctx.logger.error(`[ERROR] - ${error.message}`);
        throw new Error(`Failed to add secrets to GitHub repository: ${error.message}`);
      }
    },
  });
}
