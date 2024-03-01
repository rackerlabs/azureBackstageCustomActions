export const tenantId = {
    type: 'string',
    title: 'Tenant ID',
    description: 'The Azure AD tenant ID used to authenticate with Azure.',
  };
  
  export const clientId = {
    type: 'string',
    title: 'Client ID',
    description: 'The client ID of the Azure AD application used to authenticate with Azure.',
  };
  
  export const clientSecret = {
    type: 'string',
    title: 'Client Secret',
    description: 'The client secret of the Azure AD application used to authenticate with Azure.',
  };
  
  export const subscriptionId = {
    type: 'string',
    title: 'Subscription ID',
    description: 'The Azure subscription ID where the resources will be provisioned.',
  };
  
  export const resourceGroupName = {
    type: 'string',
    title: 'Resource Group Name',
    description: 'The name of the Azure resource group where the storage account and container will be created.',
  };
  
  export const storageAccountName = {
    type: 'string',
    title: 'Storage Account Name',
    description: 'The name of the Azure storage account where the container will be created.',
  };
  
  export const containerName = {
    type: 'string',
    title: 'Container Name',
    description: 'The name of the container to be created in the storage account.',
  };
  