// inputProperties.ts


const tenantId = {
  type: 'string',
  title: 'Tenant ID',
  description: 'The ID of the tenant in which the resources are located.',
};

const clientId = {
  type: 'string',
  title: 'Client ID',
  description: 'The ID of the client application making the request.',
};

const clientSecret = {
  type: 'string',
  title: 'Client Secret',
  description: 'The client secret used to authenticate the application.',
};

const subscriptionId = {
  type: 'string',
  title: 'Subscription ID',
  description: 'The ID of the subscription in which the resources are located.',
};

const resourceGroupName = {
  type: 'string',
  title: 'Resource Group Name',
  description: 'The name of the resource group in which to create the storage account.',
};

const storageAccountName = {
  type: 'string',
  title: 'Storage Account Name',
  description: 'The name of the storage account to create.',
};

const location = {
  type: 'string',
  title: 'Location',
  description: 'The location for the storage account.',
};

const roleAssignments = {
  type: 'object',
  title: 'Role Assignments',
  description: 'Role assignments with role names as keys and arrays of app IDs as values.',
  additionalProperties: {
    type: 'array',
    items: {
      type: 'string'
    }
  }
};

export {

  tenantId,
  subscriptionId,
  clientId,
  clientSecret,
  storageAccountName,
  resourceGroupName,
  location,
  roleAssignments,
};
