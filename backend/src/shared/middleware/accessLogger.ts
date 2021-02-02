import { Request, Response, NextFunction } from 'express';
import logger from '../Logger';

const accessLogger = (req: Request, resp: Response, next: NextFunction) => {
    logger.access(req)
    next()
}

export default accessLogger;
