## Azure Backstage Custom Actions

A collection of custom actions to effect changes within azure. These are just an initial 'working' collection which can easily be modified \ expanded.

createAppRegistrationAndServicePrincipal
`id: 'azure:create-appreg-sp'`

createAppRegistrationSecret
`'azure:create-appreg-secret'`

createFederatedCredential
`'azure:create-fedcred'`

createResourceGroup
`'azure:create-resourcegroup'`

createStorageAccount
`'azure:create-storage-account'`

createStorageAccountContainer
`'azure:create-storage-account-container'`

grantAccessToStorageAccount
`'azure:grant-access-to-storage-account'`

pause
`'custom:pause'`

createKeyVault
`'azure:create-keyvault'`

createKeyVaultSecret
`'azure:create-keyvault-secret'`


## Create App Reg and Service Principal

This utilises custom action azure:create-appreg-sp.
It is responsible for creating an application registration and service principal, and assigning the appropriate roles to the created service principal. Below is a breakdown of its components:

#### Input Parameters

* `appName`: Name of the application registration to be created.
* `tenantId`: Azure Active Directory (AAD) tenant ID.
* `clientId`: Client ID used for authentication.
* `clientSecret`: Client secret used for authentication.
* `subscriptionId`: Azure subscription ID.
* `roleDefinitionNames`: (Optional) Array of role definition names to be assigned to the service principal.

#### Output

* `success`: Indicates whether the action was successful (true or false).
* `appId`: ID of the created application registration.
* `appObjId`: Object ID of the created application registration.
* `servicePrincipalId`: ID of the created service principal.

#### Libraries

This code uses several libraries and SDKs provided by Azure and Microsoft Graph for interacting with Azure services and Azure Active Directory (AAD). Here's a breakdown of the libraries used:

* #### Azure Identity Library:

    - *ClientSecretCredential* : This is part of the Azure Identity library and is used for authenticating with Azure services using a client ID and client secret.

* #### Azure ARM Authorization Management SDK:

    - *AuthorizationManagementClient* : This SDK is part of Azure Resource Manager (ARM) and is used for managing role-based access control (RBAC) in Azure. It allows for managing role definitions and assigning roles to service principals.

* #### Microsoft Graph SDK:

    - *Client* : This is part of the Microsoft Graph SDK and is used for making requests to the Microsoft Graph API. It allows for interacting with Azure AD resources such as applications, service principals, and role assignments.

* #### UUID Library:

    - *uuidv4* : This library is used for generating unique identifiers (UUIDs) for role assignment names. It ensures that each role assignment has a unique identifier within the Azure subscription.

#### Functionality

The createAppRegistrationAndServicePrincipalAction function is responsible for defining the action.
It first calls the createAppRegistrationAndServicePrincipal function to create the application registration and service principal.
If roleDefinitionNames are provided, it iterates over each role name and calls the assignRoleToServicePrincipal function to assign the role to the service principal.
Finally, it outputs the results and handles errors if any occur.

#### Role Creation Logic

The assignRoleToServicePrincipal function is responsible for assigning roles to the service principal.
It retrieves the role definition ID based on the provided role name.
It generates a unique role assignment name.
It defines the role assignment parameters including principalId (service principal ID), roleDefinitionId, and principalType.
It creates the role assignment using the Azure Authorization Management SDK.

## Create App Registration Secret

This utilises custom action azure:create-appreg-secret.
This action creates a secret for the given service principal

#### Input Parameters

* `appObjId`: Object ID of the Azure application for which the secret is to be created.
* `tenantId`: Azure Active Directory (AAD) tenant ID.
* `clientId`: Client ID used for authentication.
* `clientSecret`: Client secret used for authentication.
* `validityDays`: How long the new secret is valid for 

#### Outputs:

* `secret`: The secret generated for the Azure application.
* `success`: Indicates whether the action was successful (true or false).
* `endDate`: The date the secret expires

#### Libraries

* Azure Identity Library:

    - *ClientSecretCredential*: Used for authenticating with Azure services using a client ID and client secret.
* Microsoft Graph Client Library:

    - *TokenCredentialAuthenticationProvider*: This authentication provider is used to authenticate requests to the Microsoft Graph API using token-based credentials.
    - *Client*: This class is used to make requests to the Microsoft Graph API. It initializes a client with middleware that includes the authentication provider.

#### Functionality:

This function is responsible for creating a secret for the specified Azure application.
It initializes the necessary credentials using ClientSecretCredential.
Sets up authentication for requests to the Microsoft Graph API using TokenCredentialAuthenticationProvider.
Initializes a Client with the authentication provider to interact with the Microsoft Graph API.
Constructs the payload for adding a password credential to the Azure application.
Makes a POST request to the Microsoft Graph API endpoint to add the password credential.
Retrieves the generated secret from the API response.
Logs success message and returns the secret.
createAppRegistrationSecretAction Function:

## Create Federated Credential 

This utilises custom action azure:create-fedcred
This custom action automates the process of creating a federated credential for an Azure application using Azure Identity and Microsoft Graph Client libraries. This custom action was created with using GitHub in mind.

#### Input Parameters

* `appObjId`: Object ID of the Azure application for which the federated credential is to be created.
* `issuer`: Issuer of the federated identity.
* `subject`: Subject of the federated identity.
* `tenantId`: Azure Active Directory (AAD) tenant ID.
* `clientId`: Client ID used for authentication.
* `clientSecret`: Client secret used for authentication.

#### Outputs:

* `success`: Indicates whether the action was successful (true or false).

#### Libraries Used:

* Azure Identity Library:

    - *ClientSecretCredential*: Used for authenticating with Azure services using a client ID and client secret.
* Microsoft Graph Client Library:

    - *TokenCredentialAuthenticationProvider*: This authentication provider is used to authenticate requests to the Microsoft Graph API using token-based credentials.
    - *Client*: This class is used to make requests to the Microsoft Graph API. It initializes a client with middleware that includes the authentication provider.

#### Functionality:

This function is responsible for creating a federated credential for the specified Azure application.
It initializes the necessary credentials using ClientSecretCredential.
Sets up authentication for requests to the Microsoft Graph API using TokenCredentialAuthenticationProvider.
Initializes a Client with the authentication provider to interact with the Microsoft Graph API.
Constructs the payload for creating a federated identity credential for the Azure application.
Makes a POST request to the Microsoft Graph API endpoint to create the federated identity credential.
Logs success message

#### Values Passed

Our subjects were constructed as such 
`repo:${{parameters.githubOrganization}}/${{parameters.projectName}}:environment:${{parameters.environmentName}}`
`repo:${{parameters.githubOrganization}}/${{parameters.projectName}}:ref:refs/heads/main`
`repo:${{parameters.githubOrganization}}/${{parameters.projectName}}:pull_request`

## Create Resource Group

This utilises custom action azure:create-resource-group. 
This custom action automates the process of creating an Azure resource group

#### Input Parameters

* `tenantId`: Azure Active Directory (AAD) tenant ID.
* `clientId`: Client ID used for authentication.
* `clientSecret`: Client secret used for authentication.
* `subscriptionId`: Azure subscription ID.
* `resourceGroupName`: Name of the resource group to be created.
* `location`: Location where the resource group will be provisioned.

#### Outputs:

* `success`: Indicates whether the action was successful (true or false).
* `id`: ID of the created resource group.

#### Libraries Used:

* Azure Identity Library:

    - *ClientSecretCredential*: Used for authenticating with Azure services using a client ID and client secret.

* Azure ARM Resources Management SDK:
    - *ResourceManagementClient*: This SDK is part of Azure Resource Manager (ARM) and is used for managing Azure resources such as resource groups.

#### Functionality:

This function is responsible for creating a resource group in Azure.
It initializes the necessary credentials using ClientSecretCredential.
Sets up a ResourceManagementClient using the provided credentials and subscription ID.
Constructs the parameters for creating the resource group, including the location.
Calls the createOrUpdate method on the resourceClient to initiate the creation of the resource group.
Logs success message upon successful creation of the resource group.

## Create Storage Account

This utilises custom action azure:create-storage-account
This custom action automates the process of creating an Azure storage account.

#### Input Parameters

* `tenantId`: Azure Active Directory (AAD) tenant ID.
* `clientId`: Client ID used for authentication.
* `clientSecret`: Client secret used for authentication.
* `subscriptionId`: Azure subscription ID.
* `resourceGroupName`: Name of the resource group in which the storage account will be created.
* `storageAccountName`: Name of the storage account to be created.
* `location`: Location where the storage account will be provisioned.

### Outputs:

* `success`: Indicates whether the action was successful (true or false).

#### Libraries Used:

* Azure Identity Library:

    - *ClientSecretCredential*: Used for authenticating with Azure services using a client ID and client secret.

* Azure ARM Storage Management SDK:

    - *StorageManagementClient*: This SDK is part of Azure Resource Manager (ARM) and is used for managing Azure storage accounts.

#### Functionality:

This function is responsible for creating a storage account in Azure.
It initializes the necessary credentials using ClientSecretCredential.
Sets up a StorageManagementClient using the provided credentials and subscription ID.
Constructs the parameters for creating the storage account, including the SKU (Standard_LRS) and kind (StorageV2).
Calls the beginCreate method on the storageClient to initiate the creation of the storage account.
Logs success message upon successful creation of the storage account.

## Grant Storage Account Access

This utilises custom action azure:grant-access-to-storage-account
This custom action automates the process of granting access to an Azure storage account.

#### Input Parameters

* `tenantId`: Azure Active Directory (AAD) tenant ID.
* `clientId`: Client ID used for authentication.
* `clientSecret`: Client secret used for authentication.
* `subscriptionId`: Azure subscription ID.
* `resourceGroupName`: Name of the resource group containing the storage account.
* `storageAccountName`: Name of the storage account to grant access to.
* `roleDefinitionName`: Name of the role definition to assign to the service principal.
* `appId`: Application ID of the service principal.

#### Outputs:

* `success`: Indicates whether the action was successful (true or false).

#### Libraries Used:
* Azure Identity Library:

    - *ClientSecretCredential*: Used for authenticating with Azure services using a client ID and client secret.

* Azure ARM Authorization SDK:

    - *AuthorizationManagementClient*: This SDK is part of Azure Resource Manager (ARM) and is used for managing role-based access control (RBAC) in Azure.

* UUID Library:

    - *v4 as uuidv4*: Imported to generate UUIDs for role assignment names.


#### Functionality:

This function is responsible for granting access to a storage account in Azure.
It initializes the necessary credentials using ClientSecretCredential.
Sets up an AuthorizationManagementClient using the provided credentials and subscription ID.
Retrieves the ID of the role definition based on its name.
Generates a unique role assignment name using uuidv4.
Constructs the scope for the role assignment, specifying the storage account's resource path.
Creates a role assignment to grant access to the storage account.
Logs success message upon successful granting of access.

## Create storage Account Container 

This utilises custom action 'azure:create-storage-account-container'
This custom action automates the process of creating a container within an Azure storage account.

#### Input Parameters

* `tenantId`: Azure Active Directory (AAD) tenant ID.
* `clientId`: Client ID used for authentication.
* `clientSecret`: Client secret used for authentication.
* `storageAccountName`: Name of the Azure storage account where the container will be created.
* `containerName`: Name of the container to be created within the storage account.

#### Outputs:

* ` success`: Indicates whether the action was successful (true or false).

#### Libraries Used:

* Azure Identity Library:

    - *ClientSecretCredential*: Used for authenticating with Azure services using a client ID and client secret.

* Azure Storage Blob SDK:

    - *BlobServiceClient*: This SDK is used to interact with Azure Blob Storage, enabling operations such as creating containers and uploading blobs.

#### Functionality:

This function is responsible for creating a container within an Azure storage account.
First it checks if the blob service name is resolvable in dns. It checks 6 times over 1 minute then will error. If DNS is resolving correctly, it initializes the necessary credentials using ClientSecretCredential.
Creates a BlobServiceClient object using the storage account URL and the credentials.
Retrieves a reference to the container using the getContainerClient method.
Attempts to create the container using the create method.
Logs success message upon successful creation of the container.

## Pause

This utilises custom action custom:pause
There have been intermittent issues seen where when trying to utilise services which require time to replicate across their backends our jobs were running so fast that the backend had not had time to complete and replicate - introducing the pause eliminates this issue.

#### Input Parameters

* `seconds`: The number of seconds you wish the job to run for

This simple function takes an input and start a timer which counts down the required amount.

## Create KeyVault

This utilises cutom action 'azure:create-keyvault'
This custom action automates the process of creating a KeyVault 

#### Input Parameters

* `keyVaultName`: Name of the Keyvault to be created
* `clientId`: Client ID used for authentication.
* `clientSecret`: Client secret used for authentication.
* `subscriptionId`: Azure subscription ID.
* `resourceGroupName`: Name of the resource group to be created.
* `location`: Location where the resource group will be provisioned.
* `tenantId`: Azure Active Directory (AAD) tenant ID.
* `appId`: Client ID to be granted access to Keyvault

#### Libraries Used:

* Azure Identity Library:

    - *ClientSecretCredential*: Used for authenticating with Azure services using a client ID and client secret.

* Azure Arm-Keyvault Library

    - *KeyVaultManagementClient*: Used to create a keyvault
    
    - *VaultCreateOrUpdateParameters*: Used to set Parameters on keyvaults

#### Outputs:

* `success`: Indicates whether the action was successful (true or false).
* `keyVaultId`: The id of the newly created Keyvault
* `keyVaultUri`: The uri of the newly created Keyvault


## Create Keyvault Secret

This utilises cutom action 'azure:create-keyvault-secret'
This custom action automates the process of creating a KeyVault Secret

#### Input Parameters

* `keyVaultUri`: The URI of the Keyvault to be used
* `clientId`: Client ID used for authentication.
* `clientSecret`: Client secret used for authentication.
* `tenantId`: Azure Active Directory (AAD) tenant ID.
* `secretName`: The name of the secret to be created
* `secretValue`: The value of the secret 

#### Libraries Used:

* Azure Identity Library:

    - *ClientSecretCredential*: Used for authenticating with Azure services using a client ID and client secret.

* Azure keyvault-secrets Library

    - *SecretClient*: Used to create keyvault secret

#### Outputs:

* `success`: Indicates whether the action was successful (true or false).
* `secretUri`: The uri of the newly created Secret

## Github Backstage Custom Actions

A number of actions to interact with Github repos using a PAT .

createGitHubEnvironment
`id: 'github:create-environment'`

createGithubRepoSecret
id`github:add-secrets`

## Create GitHub Environment

This function utilizes the `github:create-environment` custom action. It is responsible for creating or updating a GitHub environment within a specified repository, assigning reviewers, and optionally adding encrypted secrets to the environment. Below is a breakdown of its components:

#### Input Parameters

- `token`: Personal access token for authenticating with the GitHub API.
- `repository`: Name of the repository where the environment will be created or updated.
- `environmentName`: Name of the environment to create or update.
- `owner`: Owner of the repository (user or organization).
- `reviewerUsernames`: (Optional) Array of GitHub usernames to be assigned as reviewers for the environment.
- `reviewerTeamname`: (Optional) Name of the GitHub team to be assigned as reviewers for the environment.
- `secrets`: (Optional) Object containing key-value pairs of secrets to be added to the environment.

#### Output

- `success`: Indicates whether the action was successful (true or false).

#### Libraries

This code uses several libraries and SDKs provided by GitHub and additional utilities for encryption. Here's a breakdown of the libraries used:

* #### Octokit:

    - *Octokit* : This is part of the Octokit library provided by GitHub. It is used for making requests to the GitHub API and interacting with GitHub resources such as repositories, environments, teams, and users.

* #### Sodium:

    - *libsodium-wrappers* : This library is used for encrypting secrets before they are stored in the GitHub environment. It ensures that secrets are securely handled and stored.

#### Functionality

The `createGitHubEnvironmentAction` function is responsible for defining the action.
It first calls the `createGitHubEnvironment` function to create or update the GitHub environment.
If reviewer usernames or a team name are provided, it fetches their IDs and assigns them as reviewers.
If secrets are provided, it encrypts them and adds them to the environment.
Finally, it outputs the results and handles errors if any occur.

#### Logic

The `createGitHubEnvironment` function is responsible for the main logic of creating or updating the GitHub environment.
It retrieves the repository details using the provided token and repository name.
It fetches user IDs for the specified reviewer usernames and the team ID for the specified reviewer team name.
It combines the reviewers and assigns them to the environment.
It creates or updates the environment using the GitHub API.
If secrets are provided, it encrypts each secret using the public key of the environment and stores the encrypted secrets.
It logs the success or error messages and sets the appropriate output.


## Add Secrets to GitHub Repository

This function utilizes the `github:add-secrets` custom action. It is responsible for adding encrypted secrets to a specified GitHub repository. Below is a breakdown of its components:

#### Input Parameters

- `token`: Personal access token for authenticating with the GitHub API.
- `repository`: Name of the repository where the secrets will be added.
- `owner`: Owner of the repository (user or organization).
- `secrets`: Object containing key-value pairs of secrets to be added to the repository.

#### Output

- `success`: Indicates whether the action was successful (true or false).

#### Libraries

This code uses several libraries and SDKs provided by GitHub and additional utilities for encryption. Here's a breakdown of the libraries used:

* #### Octokit:

    - *Octokit* : This is part of the Octokit library provided by GitHub. It is used for making requests to the GitHub API and interacting with GitHub resources such as repositories and secrets.

* #### Sodium:

    - *libsodium-wrappers* : This library is used for encrypting secrets before they are stored in the GitHub repository. It ensures that secrets are securely handled and stored.

#### Functionality

The `addSecretsToGitHubRepositoryAction` function is responsible for defining the action.
It first calls the `addSecretsToGitHubRepository` function to add the encrypted secrets to the specified GitHub repository.
If secrets are provided, it encrypts them using the repository's public key and stores the encrypted secrets in the repository.
Finally, it outputs the results and handles errors if any occur.

#### Secret Addition Logic

The `addSecretsToGitHubRepository` function is responsible for the main logic of adding encrypted secrets to the GitHub repository.
It retrieves the repository's public key using the provided token, repository name, and owner.
It encrypts each secret using the public key of the repository and stores the encrypted secrets in the repository using the GitHub API.
It logs the success or error messages and sets the appropriate output.
