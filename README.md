# Contacts API using Serverless


## Installation/deployment instructions

Follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `sls dynamodb install` to be able to run dynamodb locally.
- Run `sls offline start` to run the project locally

Note that in some cases `sls dynamodb install` fails to download the package, if thats the case, a fix is to go to `\node_modules\dynamodb-localhost\dynamodb\config.json` and change the "download_url" from `http://......` to `https://......` and in `\node_modules\dynamodb-localhost\dynamodb\installer.js` change the line of code `http = require("http")` to `http = require("https")`.

### To use the API
After running `sls offline start` the following endpoints will be accessible

#### POST | http://localhost:3000/dev/createUser
- Creates a user
- Payload
`{
    "username": "username",
    "password": "password"
}`

#### POST | http://localhost:3000/dev/login
- Authenticates the user and returns a token.
- Tokens are valid only for 30 minutes.
- Payload
`{
    "username": "username",
    "password": "password"
}`
- response body of a successfull login is in the form 
`{
    "token": "token"
}`



#### POST | http://localhost:3000/dev/createContract
- Creates a contract and returns the id of created contract
- Request must have an "Authorization" header with value "Bearer token", where the token is retrieved using the login API
- Payload: `{
      userID: “uuid”,
      contractName: “Another String”,
      templateID: “uuid”
}`
- Response: `{
    ContractID: “uuid”
}` 

#### GET  | http://localhost:3000/dev/getContractIDs
- Returns a list containing the IDs of all created contracts
- Request must have an "Authorization" header with value "Bearer token", where the token is retrieved using the login API
- Response: `[{
    contractID: “uuid”,
},
{
    contractID: “uuid”,
}...]` 

#### GET  | http://localhost:3000/dev/getContract?id=
- Returns the contact with customerID matching id query parameter
- Request must have an "Authorization" header with value "Bearer token", where the token is retrieved using the login API
- Response: `{
    userID: "uuid",
    contractName: "ContractName",
    templateID: "uuid",
    contractID: "uuid"
}` 

### To run the Unit Tests
- Run `npm test`





