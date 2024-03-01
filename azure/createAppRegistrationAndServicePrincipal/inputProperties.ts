// inputProperties.ts
const appName = {
  title: 'Project Name',
  description: 'Name of the project',
  type: 'string',
};

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

const roleDefinitionNames = {
  title: 'RBAC Role Names',
  description: 'List of RBAC Role Names to assign to the service principal',
  type: 'array',
  items: {
    type: 'string',
  },
};

export {
  appName,
  tenantId,
  subscriptionId,
  clientId,
  clientSecret,
  roleDefinitionNames,
};
