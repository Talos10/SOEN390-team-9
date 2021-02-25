import log4js from 'log4js';
import { config } from '../../config';
import { Request } from 'express';

class Logger {
    public logger: log4js.Logger;

    constructor() {
        this.configureLogger();
        this.logger = log4js.getLogger();
    }

    private configureLogger() {
        log4js.configure({
            appenders: {
                file: { type: 'file', filename: 'out.log', layout: { type: 'messagePassThrough' } },
                console: { type: 'stdout' }
            },
            categories: {
                default: { appenders: ['file', 'console'], level: config.logger.level }
            }
        });
    }

    private log(message: string, level: string, tags?: any[], description?: any) {
        const d = new Date();
        const msg = {
            message: message,
            level: level,
            tags: tags,
            description: description,
            time: d
        };
        const strMsg = JSON.stringify(msg);

        if (config.env !== 'development' && config.env !== 'production') return;

        switch (level) {
            case 'trace':
                this.logger.trace(strMsg);
                break;
            case 'debug':
                this.logger.debug(strMsg);
                break;
            case 'info':
                this.logger.info(strMsg);
                break;
            case 'warn':
                this.logger.warn(strMsg);
                break;
            case 'error':
                this.logger.error(strMsg);
                break;
            case 'fatal':
                this.logger.fatal(strMsg);
                break;
        }
    }

    public trace(message: string, tags?: any[], description?: any | any[]) {
        this.log(message, 'trace', tags, description);
    }

    public debug(message: string, tags?: any[], description?: any | any[]) {
        this.log(message, 'debug', tags, description);
    }

    public info(message: string, tags?: any[], description?: any | any[]) {
        this.log(message, 'info', tags, description);
    }

    public warn(message: string, tags?: any[], description?: any | any[]) {
        this.log(message, 'warn', tags, description);
    }

    public error(message: string, tags?: any[], description?: any | any[]) {
        this.log(message, 'error', tags, description);
    }

    public fatal(message: string, tags?: any[], description?: any | any[]) {
        this.log(message, 'fatal', tags, description);
    }

    public access(req: Request) {
        const d = new Date();
        const msg = {
            method: req.method,
            path: req.path,
            body: req.body,
            ip: req.ip,
            params: req.params,
            time: d
        };
        const strMsg = JSON.stringify(msg);
        if (config.env !== 'development' && config.env !== 'production') return;
        this.logger.info(strMsg);
    }

    public accessError(req: Request, description?: any, message?: any) {
        const d = new Date();
        const msg = {
            method: req.method,
            path: req.path,
            body: req.body,
            ip: req.ip,
            params: req.params,
            time: d,
            message: message,
            description: description
        };
        const strMsg = JSON.stringify(msg);
        if (config.env !== 'development' && config.env !== 'production') return;
        this.logger.error(strMsg);
    }
}

const logger = new Logger();

export default logger;
