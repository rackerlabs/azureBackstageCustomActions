// inputProperties.ts

export const tenantId = {
  type: 'string',
  title: 'Tenant ID',
  description: 'ID of the Azure Active Directory tenant.',
};

export const clientId = {
  type: 'string',
  title: 'Client ID',
  description: 'ID of the Azure Active Directory application (service principal).',
};

export const clientSecret = {
  type: 'string',
  title: 'Client Secret',
  description: 'Client secret of the Azure Active Directory application (service principal).',
};

export const subscriptionId = {
  type: 'string',
  title: 'Subscription ID',
  description: 'ID of the Azure subscription.',
};

export const resourceGroupName = {
  type: 'string',
  title: 'Resource Group Name',
  description: 'Name of the Azure resource group where the storage account is located.',
};

export const storageAccountName = {
  type: 'string',
  title: 'Storage Account Name',
  description: 'Name of the Azure storage account to grant access to.',
};

export const roleDefinitionName = {
  type: 'string',
  title: 'Role Definition Name',
  description: 'Name of the role definition to assign.',
};

export const appId = {
  type: 'string',
  title: 'App ID',
  description: 'ID of the application to grant access to.',
};

export const location = {
  type: 'string',
  title: 'Location',
  description: 'Location where the storage account will be created.',
};

export const roleDefinitionId = {
  type: 'string',
  title: 'Role Definition ID',
  description: 'ID of the role definition to assign.',
}