import { getDynamodb } from "../lib/dynamodb";

export async function getContract(event) {

    const { id } = event.queryStringParameters;

    let contract;

    if(!id){
        return {
            statusCode: 403,
            body: "provide contractID as a query parameter getContract?id=uuid",
        };
    }


    try {
        contract = await getDynamodb(process.env.CONTRACTS_TABLE_NAME, { 'contractID': id });
    } catch (error) {
        return {
            statusCode: 500,
            body: "Internal Server Error",
        };
    }


    if (!contract) {
        return {
            statusCode: 404,
            body: `Contract with ID ${id} not found!`,
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(contract),
    };
}

