
import { createUser } from '@functions/createUserFunction';
import commonMiddleware from '../lib/commonMiddleware';


export const handler = commonMiddleware(createUser);



