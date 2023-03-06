import { afterAll, beforeAll, expect, test } from "@jest/globals";
import { v4 as uuidv4 } from 'uuid';
import { getDynamodb, putDynamodb } from '../src/lib/dynamodb';

let env;
beforeAll(() => {
    env = process.env;
    process.env = {
        ...env,
        CONTRACTS_TABLE_NAME: "ContractsTable-test",
        USERS_TABLE_NAME: "UsersTable-test",
        JWT_SECRET: "secret"
    }
});

afterAll(() => {
    process.env = env;
});


test('should insert item into contract table', async () => {
    expect.assertions(1);
    const contractID = uuidv4()
    const contract = {
        contractID,
        userID: "user Test",
        contractName: "Test Contract Name",
        templateID: uuidv4()
    };

    await putDynamodb(process.env.CONTRACTS_TABLE_NAME as string, contract);
    const Item = await getDynamodb(process.env.CONTRACTS_TABLE_NAME as string, { contractID });
    expect(Item).toEqual(contract);
});
