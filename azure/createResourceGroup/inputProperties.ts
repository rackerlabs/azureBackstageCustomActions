// inputProperties.ts


const tenantId = {
  title: 'Tenant ID',
  description: 'Azure AD tenant ID',
  type: 'string',
};

const subscriptionId = {
  title: 'Subscription ID',
  description: 'Azure subscription ID',
  type: 'string',
};

const clientId = {
  title: 'Client ID',
  description: 'Azure AD application client ID',
  type: 'string',
};

const clientSecret = {
  title: 'Client Secret',
  description: 'Azure AD application client secret',
  type: 'string',
};

const resourceGroupName = {
  title: 'Resource Group Name',
  description: 'Name of Resource Group',
  type: 'string'
}

const location = {
  title: 'Location',
  description: 'Location of the Resource Group',
  type: 'string'
}

export {
  
  tenantId,
  subscriptionId,
  clientId,
  clientSecret,
  resourceGroupName,
  location,
  
};
