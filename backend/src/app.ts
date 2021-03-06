import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import { Application } from 'express';

import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import logger from './shared/Logger';

class App {
    public app: Application;
    public port: number;
    public server: any;

    constructor(appInit: { port: number; middleWares: any; controllers: any }) {
        this.app = express();
        this.port = appInit.port;

        this.middlewares(appInit.middleWares);
        this.routes(appInit.controllers);
        this.env();
        this.error();
        require('./shared/passportHandler');
    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare);
        });
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void }) {
        this.app.get('/', (req, res) => {
            res.send('Backend is running');
        });

        controllers.forEach(controller => {
            this.app.use(controller.path, controller.router);
        });
    }

    private env() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());

        // Show routes called in console during development
        if (process.env.NODE_ENV === 'development') {
            this.app.use(morgan('dev'));
        }

        // Security
        if (process.env.NODE_ENV === 'production') {
            this.app.use(helmet());
        }
    }

    private error() {
        const { INTERNAL_SERVER_ERROR } = StatusCodes;
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            logger.accessError(req, err.stack, err.message);
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message
            });
        });
    }

    public listen() {
        this.server = this.app.listen(this.port, () => {
            logger.info(`App listening on the http://localhost:${this.port}`);
        });
    }

    public shutdown() {
        this.server.close();
    }
}

export default App;
