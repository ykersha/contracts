import { scanDynamodb } from "../lib/dynamodb";

export async function getContractIDs() {

    try {
        const contracts = await scanDynamodb(process.env.CONTRACTS_TABLE_NAME, "contractID");
        return {
            statusCode: 200,
            body: JSON.stringify(contracts),
        };
    } catch (error) {
        return {
            statusCode: 501,
            body: "Internal Server Error",
        };
    }
}
