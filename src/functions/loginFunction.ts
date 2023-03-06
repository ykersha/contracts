import { sign } from 'jsonwebtoken';
import * as bcrypt from "bcryptjs";
import { getDynamodb } from "../lib/dynamodb";


export async function login(event) {
    try {
        const { username, password } = event.body;

        if(!username || !password){
            return {
                statusCode: 403,
                body: "body must contain username and password",
            };
        }

        let userResult = await getDynamodb(process.env.USERS_TABLE_NAME, { username: username });

        if (typeof userResult !== 'undefined') {
            const compareResult = bcrypt.compareSync(password, userResult.password);
            if (compareResult) {

                let exp = Date.now() / 1000 + 1800;

                let token = sign({
                    username: userResult.username,
                    exp
                }, process.env.JWT_SECRET);

                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        token,

                    }),
                }
            }
            return {
                statusCode: 401,
                body: `Unauthorized`,
            };
        }

        return {
            statusCode: 404,
            body: `Username or password are incorrect`,
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: "Internal Server Error",
        };
    }
}
