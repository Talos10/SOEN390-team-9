import { Request, Response, NextFunction } from 'express';
import logger from '../Logger';

const accessLogger = (req: Request, resp: Response, next: NextFunction) => {
    logger.info(`Request logged: ${req.method} ${req.path}`)
    next()
}

export default accessLogger;
