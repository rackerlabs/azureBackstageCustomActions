import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';
import { Octokit } from '@octokit/rest';
import Sodium from 'libsodium-wrappers';

async function fetchUserIDs(octokit: Octokit, usernames: string[]) {
  const userIDs = [];
  for (const username of usernames) {
    try {
      const response = await octokit.users.getByUsername({ username });
      const userId = response.data.id;
      userIDs.push({ username, userId });
    } catch (error: any) {
      console.error(`Error fetching user ID for ${error.message}`);
    }
  }
  return userIDs;
}

async function createGitHubEnvironment(ctx: any, client: Octokit, repository: string, environmentName: string, owner: string, reviewerUsernames?: string[], reviewerTeamname?: string, secrets?: { [key: string]: string }) {
  const logger = ctx.logger;

  try {
    // Get repository details
    const repoDetails = await client.rest.repos.get({
      owner: owner,
      repo: repository,
    });

    // Fetch user IDs for reviewers
    let reviewers: { username: string; userId: number; }[] = [];
    if (reviewerUsernames) {
      reviewers = await fetchUserIDs(client, reviewerUsernames);
    }

    // Fetch team ID for reviewer team
    let teamId = '';
    if (reviewerTeamname) {
      try {
        const response = await client.rest.teams.getByName({
          org: owner,
          team_slug: reviewerTeamname
        });
        teamId = response.data.id.toString();
      } catch (error : any) {
        console.error(`Error fetching team ID for ${reviewerTeamname}: ${error.message}`);
      }
    }

    // Combine reviewers and team
    const allReviewers = [
      ...reviewers.map(reviewer => ({
        type: 'User' as const, // Assuming reviewer is always a user
        id: reviewer.userId, // Assuming userId is always a number
      })),
      ...(teamId ? [{
        type: 'Team' as const,
        id: parseInt(teamId), // Convert teamId to number
      }] : [])
    ];
    

    // Create or update environment
    await client.rest.repos.createOrUpdateEnvironment({
      owner: owner,
      repo: repository,
      environment_name: environmentName,
      reviewers: allReviewers,
    });

    logger.info(`Environment '${environmentName}' updated successfully for repository '${repository}'`);

    // If secrets are provided, add them
    if (secrets) {
      const publicKeyResponse = await client.rest.actions.getEnvironmentPublicKey({
        repository_id: repoDetails.data.id,
        environment_name: environmentName,
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

        await client.rest.actions.createOrUpdateEnvironmentSecret({
          repository_id: repoDetails.data.id,
          environment_name: environmentName,
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
    logger.error(`Failed to update environment: ${error.message}`);
    throw new Error(`Failed to update environment: ${error.message}`);
  }
}

export function createGitHubEnvironmentAction() {
  return createTemplateAction<{
    token: string;
    repository: string;
    environmentName: string;
    owner: string;
    reviewerUsernames?: string[];
    reviewerTeamname?: string; // Changed to singular
    secrets?: { [key: string]: string };
  }>({
    id: 'github:create-environment',
    schema: {
      input: {
        type: 'object',
        required: ['token', 'repository', 'environmentName', 'owner'],
        properties: {
          token: inputProps.token,
          repository: inputProps.repository,
          environmentName: inputProps.environmentName,
          owner: inputProps.owner,
          reviewerUsernames: inputProps.reviewerUsernames,
          reviewerTeamname: inputProps.reviewerTeamname, // Changed to singular
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
        const { token, repository, environmentName, owner, reviewerUsernames, reviewerTeamname, secrets } = ctx.input;

        // Initialize Octokit client
        const client = new Octokit({ auth: token });

        // Call function to create GitHub environment
        await createGitHubEnvironment(ctx, client, repository, environmentName, owner, reviewerUsernames, reviewerTeamname, secrets);

        // Log success output
        ctx.output(outputProps.success.title, 'true');
      } catch (error: any) {
        ctx.logger.error(`[ERROR] - ${error.message}`);
        throw new Error(`Failed to create GitHub environment: ${error.message}`);
      }
    },
  });
}
