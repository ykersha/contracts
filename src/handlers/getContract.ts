import commonMiddleware from '../lib/commonMiddleware';
import { getContract } from '@functions/getContractFunction';

export const handler = commonMiddleware(getContract);


