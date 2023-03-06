export default {
  ContractsTable: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "ContractsTable-${self:provider.stage}",
      AttributeDefinitions: [{ AttributeName: "contractID", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "contractID", KeyType: "HASH" }],
      BillingMode: "PAY_PER_REQUEST"
    },
  }
};