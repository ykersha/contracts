import commonMiddleware from '../lib/commonMiddleware';
import { createContract } from '@functions/createContractFunction';

export const handler = commonMiddleware(createContract);



