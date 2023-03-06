import commonMiddleware from '../lib/commonMiddleware';
import { getContractIDs } from '@functions/getContractIDsFunction';

export const handler = commonMiddleware(getContractIDs);