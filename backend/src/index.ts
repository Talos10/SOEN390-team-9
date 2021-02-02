import App from './app';

import accessLogger from './shared/middleware/accessLogger';
import * as bodyParser from 'body-parser'

import { config } from '../config';

import UserController from './User/user.controller';

// Start the server
const port = config.port;

const app = new App({
    port: port,
    controllers: [
        new UserController()
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        accessLogger
    ]
});

app.listen();
