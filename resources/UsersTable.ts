export default {
    UsersTable: {
      Type: "AWS::DynamoDB::Table",
      Properties: {
        TableName: "UsersTable-${self:provider.stage}",
        AttributeDefinitions: [{ AttributeName: "username", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "username", KeyType: "HASH" }],
        BillingMode: "PAY_PER_REQUEST"
      },
    }
  };