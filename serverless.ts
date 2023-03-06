import type { AWS } from '@serverless/typescript';
import ContractsTable from "./resources/ContractsTable";
import UsersTable from "./resources/UsersTable";
import contractBodySchema from 'src/schemas/contractBodySchema';
import userSchema from 'src/schemas/userSchema';

const serverlessConfiguration: AWS = {
  service: 'contracts-ts',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: "${opt:stage, 'dev'}",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      CONTRACTS_TABLE_NAME: "${self:custom.ContractsTable.name}",
      USERS_TABLE_NAME: "${self:custom.UsersTable.name}",
      JWT_SECRET: "secret"
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:Scan'],
            Resource: [
              "${self:custom.ContractsTable.arn}"
            ]
          }
        ]
      }
    }
  },

  resources: {
    Resources: {
      ...ContractsTable,
      ...UsersTable
    },
  },

  functions: {
    validate:{
      handler: "src/handlers/validate.handler",
    },
    createContract: {
      handler: "src/handlers/createContract.handler",
      events: [
        {
          http: {
            method: 'POST',
            path: '/createContract',
            authorizer: 'validate',
            request: {
              schemas: {
                'application/json': contractBodySchema,
              },
            },
          }
        }
      ]
    },
    getContractIDs: {
      handler: "src/handlers/getContractIDs.handler",
      events: [
        {
          http: {
            method: 'GET',
            path: '/getContractIDs',
            authorizer: 'validate'
          }
        }
      ]
    },
    getContract: {
      handler: "src/handlers/getContract.handler",
      events: [
        {
          http: {
            method: 'GET',
            path: '/getContract',
            authorizer: 'validate'
          }
        }
      ]
    },
    createUser: {
      handler: "src/handlers/createUser.handler",
      events: [
        {
          http: {
            method: 'POST',
            path: '/createUser',
            request: {
              schemas: {
                'application/json': userSchema,
              },
            },
          }
        }
      ]
    },
    login: {
      handler: "src/handlers/login.handler",
      events: [
        {
          http: {
            method: 'POST',
            path: '/login',
            request: {
              schemas: {
                'application/json': userSchema,
              },
            },
          }
        }
      ]
    },
  
  },

  package: { individually: true },

  custom: {
    ContractsTable: {
      name: "ContractsTable-dev",
      arn: { "Fn::GetAtt": ["ContractsTable-${self:provider.stage}", "Arn"] },
    },
    UsersTable: {
      name: "UsersTable-dev",
      arn: { "Fn::GetAtt": ["UsersTable-${self:provider.stage}", "Arn"] },
    },
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      },
      migration: {
        dir: "offline/migrations"
      }
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
