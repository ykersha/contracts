import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { v4 as uuidv4 } from 'uuid';
import { createContract } from '../src/functions/createContractFunction';
import { createUser } from '../src/functions/createUserFunction';
import { login } from '../src/functions/loginFunction';
import { getContractIDs } from '../src/functions/getContractIDsFunction';
import { getContract } from '../src/functions/getContractFunction';


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

describe('Creating Contracts', () => {

    test('Create contract success', async () => {
        expect.assertions(2);

        const res = await createContract({
            body: {
                userID: "user Test",
                contractName: "Test Contract Name",
                templateID: uuidv4()
            }
        })

        expect(res.statusCode).toEqual(201);
        expect(res.body).toContain("contractID");
    });

    test('create contract with missing input', async () => {
        expect.assertions(1);

        const res = await createContract({
            body: {
                userID: "user Test",
                contractName: "Test Contract Name",
            }
        })

        expect(res.statusCode).toEqual(400);
    });
});


describe('Creating Users', () => {

    test('create user success', async () => {
        expect.assertions(1);

        const user = {
            username: "username",
            password: "Test Contract Name"
        }

        const res = await createUser({
            body: user
        })
        expect(res.statusCode).toEqual(201);
    });

    test('create user with missing username', async () => {
        expect.assertions(1);

        const res = await createUser({
            body: {
                password: "Test Contract Name"
            }
        })
        expect(res.statusCode).toEqual(403);
    });

    test('create user with missing password', async () => {
        expect.assertions(1);

        const res = await createUser({
            body: {
                username: "Test Contract Name"
            }
        })
        expect(res.statusCode).toEqual(403);
    });
});


describe('Testing login', () => {
    beforeAll(async () => {
        await createUser({
            body: {
                username: "newUserName",
                password: "12345"
            }
        })
    });

    test('login success', async () => {
        expect.assertions(2);

        const res = await login({
            body: {
                username: "newUserName",
                password: "12345"
            }
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toContain("token");
    });

    test('incorrect password', async () => {
        expect.assertions(1);

        const res = await login({
            body: {
                username: "newUserName",
                password: "123"
            }
        });
        expect(res.statusCode).toEqual(401);
    });

    test('incorrect username', async () => {
        expect.assertions(1);

        const res = await login({
            body: {
                username: "notARealUserName",
                password: "123"
            }
        });
        expect(res.statusCode).toEqual(404);
    });

    test('no password', async () => {
        expect.assertions(1);

        const res = await login({
            body: {
                username: "newUserName",
            }
        });
        expect(res.statusCode).toEqual(403);
    });

    test('no username', async () => {
        expect.assertions(1);

        const res = await login({
            body: {
                password: "newUserName"
            }
        });
        expect(res.statusCode).toEqual(403);
    });


});




describe('Getting contracts', () => {

    let contracts;

    beforeAll(async () => {

        contracts = [{
            userID: "user1",
            contractName: "Contract1",
            templateID: uuidv4(),
            contractID: ""
        }, {
            userID: "user12",
            contractName: "Contract2",
            templateID: uuidv4(),
            contractID: ""
        }];

        const res1 = await createContract({
            body: contracts[0]
        });
        contracts[0].contractID = JSON.parse(res1.body as string).contractID;

        const res2 = await createContract({
            body: contracts[1]
        });
        contracts[1].contractID = JSON.parse(res2.body as string).contractID;
    });


    test('get all ContractIDs', async () => {
        expect.assertions(3);

        const res = await getContractIDs();
        const returnedContracts = res.body;

        expect(res.statusCode).toEqual(200);
        expect(returnedContracts).toContain(contracts[0].contractID);
        expect(returnedContracts).toContain(contracts[1].contractID);

    });

    test('get a Contract', async () => {
        expect.assertions(2);

        const res = await getContract({
            queryStringParameters: {
                id: contracts[0].contractID
            }
        });

        const contract = JSON.parse(res.body) as object;
        expect(res.statusCode).toEqual(200);
        expect(contract).toMatchObject(contracts[0]);
    });

    test('get contract using incorrect contract ID', async () => {
        expect.assertions(1);

        const res = await getContract({
            queryStringParameters: { id: '1215411dnjdhsv154sdfdsADsfds' }
        });

        expect(res.statusCode).toEqual(404);
    });

    test('get contract without passing a contract ID', async () => {
        expect.assertions(1);
        const res = await getContract({
            queryStringParameters: {}
        });
        expect(res.statusCode).toEqual(403);
    });

});
