import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import * as createHttpError from "http-errors";

let options: object = {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
};

if (process.env.JEST_WORKER_ID) {
    options = {
        endpoint: 'http://localhost:8000',
        region: 'local-env',
        sslEnabled: false
    }
}

const client = new DynamoDBClient(options);

const dynamo = DynamoDBDocumentClient.from(client);

async function putDynamodb(tableName: string, item: object) {
    try {
        const command = new PutCommand({
            TableName: tableName,
            Item: item
        });

        return await dynamo.send(command);

    } catch (error) {
        console.log(error);
        throw new createHttpError.InternalServerError(error);
    }
}

async function scanDynamodb(tableName: string, projection = "") {
    try {
        const command = new ScanCommand({
            TableName: tableName,
            ProjectionExpression: projection
        })
        const response = await dynamo.send(command);
        return response.Items;
    } catch (error) {
        console.error(error);
        throw new createHttpError.InternalServerError(error);
    }
}

async function getDynamodb(tableName: string, key: object) {
    try {
        const command = new GetCommand({
            TableName: tableName,
            Key: key
        })
        const response = await dynamo.send(command);
        return response.Item;
    } catch (error) {
        console.error(error);
        throw new createHttpError.InternalServerError(error);
    }
}


export {
    putDynamodb,
    scanDynamodb,
    getDynamodb
}