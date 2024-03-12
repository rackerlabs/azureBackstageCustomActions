export const keyVaultName = {
    type: 'string',
    description: 'The name of the Key Vault to create',
  };
  
  export const clientId = {
    type: 'string',
    description: 'The Client ID used for authentication',
  };
  
  export const clientSecret = {
    type: 'string',
    description: 'The Client Secret used for authentication',
  };
  
  export const subscriptionId = {
    type: 'string',
    description: 'The Azure subscription ID',
  };
  
  export const resourceGroupName = {
    type: 'string',
    description: 'The name of the resource group to create the Key Vault in',
  };
  
  export const location = {
    type: 'string',
    description: 'The Azure region where the Key Vault should be created',
  };
  
  export const tenantId = {
    type: 'string',
    description: 'The Tenant ID used for authentication',
  };
  
  export const appId = {
    type: 'AppId',
    description: 'App ID to assign access to ',
  };