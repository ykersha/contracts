import { putDynamodb } from "../lib/dynamodb";
import { v4 as uuidv4 } from 'uuid';

export async function createContract(event) {


  const { userID, contractName, templateID } = event.body;

  if (!userID || !contractName || !templateID) {
    return {
      statusCode: 400
    };
  }

  const contractID = uuidv4();

  const contract = {
    contractID,
    userID,
    contractName,
    templateID
  };

  try {
    await putDynamodb(process.env.CONTRACTS_TABLE_NAME, contract)
  } catch (error) {
    return {
      statusCode: 501,
      body: "Internal Server Error",
    };
  }
  
  return {
    statusCode: 201,
    body: JSON.stringify({ contractID }),
  };
}