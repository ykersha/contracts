import commonMiddleware from '../lib/commonMiddleware';
import { login } from '@functions/loginFunction';

export const handler = commonMiddleware(login);