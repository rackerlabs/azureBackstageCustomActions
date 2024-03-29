// inputProperties.ts
const appObjId = {
  title: 'appObjId',
  description: 'appObjId',
  type: 'string',
};

const tenantId = {
  title: 'Tenant ID',
  description: 'Azure AD tenant ID',
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

const validityDays = {
  title: 'Days Secret is Valid',
  description: 'Amount of time secret is valid',
  type: 'number',
};

export {
  appObjId,
  tenantId,
  clientId,
  clientSecret,
  validityDays,
};
