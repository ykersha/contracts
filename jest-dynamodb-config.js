module.exports = {
    tables: [
        {
            TableName: "ContractsTable-test",
            KeySchema: [
                {
                    AttributeName: "contractID",
                    KeyType: "HASH"
                }
            ],
            AttributeDefinitions: [
                {
                    AttributeName: "contractID",
                    AttributeType: "S"
                }
            ],
            BillingMode: "PAY_PER_REQUEST"

        },
        {
            TableName: "UsersTable-test",
            KeySchema: [
                {
                    AttributeName: "username",
                    KeyType: "HASH"
                }
            ],
            AttributeDefinitions: [
                {
                    AttributeName: "username",
                    AttributeType: "S"
                }
            ],
            BillingMode: "PAY_PER_REQUEST"
        }
    ]
}