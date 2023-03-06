
import { putDynamodb } from '../lib/dynamodb';
const bcrypt = require('bcryptjs');

export async function createUser(event) {

  const { username, password } = event.body;

  if (typeof password === 'undefined' || password.length < 1 || typeof username === 'undefined' ) {
    return {
      statusCode: 403,
      body: "Username and Password must be provided",
    };
  }

  const user = {
    username,
    password: bcrypt.hashSync(password, 10)
  };

  try {
    await putDynamodb(process.env.USERS_TABLE_NAME, user);
  } catch (error) {
    return {
      statusCode: 501,
      body: "Internal Server Error",
    };
  }


  return {
    statusCode: 201,
    body: JSON.stringify(user),
  };
}

