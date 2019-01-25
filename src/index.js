import logger from './winston';
import { sum } from './utils';

logger.info(`The result of 8 + 2 is ${sum(8, 2)}`);
