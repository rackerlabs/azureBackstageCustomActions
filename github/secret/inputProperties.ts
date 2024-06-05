export const token = {
    type: 'string',
    title: 'GitHub Token',
    description: 'Personal access token for authenticating with GitHub',
  };
  
  export const repository = {
    type: 'string',
    title: 'Repository Name',
    description: 'Name of the GitHub repository where secrets will be added',
  };
  
  export const owner = {
    type: 'string',
    title: 'Repository Owner',
    description: 'Owner of the GitHub repository where secrets will be added',
  };
  
  export const secrets = {
    type: 'object',
    title: 'Secrets',
    description: 'Key-value pairs of secrets to be added to the repository',
    additionalProperties: {
      type: 'string',
      title: 'Secret Value',
      description: 'Value of the secret',
    },
  };
  