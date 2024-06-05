const token = {
  type: 'string',
  title: 'GitHub Token',
  description: 'Personal access token for accessing GitHub API.',
};

const repository = {
  type: 'string',
  title: 'Repository',
  description: 'The name of the GitHub repository where the environment will be updated.',
};

const environmentName = {
  type: 'string',
  title: 'Environment Name',
  description: 'The name of the environment to update.',
};

const owner = {
  type: 'string',
  title: 'Repository Owner',
  description: 'The owner of the GitHub repository where the environment will be updated.',
};

const reviewerUsernames = {
  type: 'array',
  title: 'Reviewer Usernames',
  description: 'Usernames of reviewers to assign to the environment (optional).',
  items: {
    type: 'string',
  },
};

const reviewerTeamname = {
  type: 'string',
  title: 'Reviewer Teamname',
  description: 'Teamname of reviewers to assign to the environment (optional).',
};

const secrets = {
  title: 'Repository Secrets',
  description: `Secrets attached to the repository`,
  type: 'object',
};

export {
  token,
  repository,
  environmentName,
  owner,
  reviewerUsernames,
  reviewerTeamname,
  secrets,
};
