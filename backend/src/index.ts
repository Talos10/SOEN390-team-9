import App from './app';

import accessLogger from './shared/middleware/accessLogger';
import * as bodyParser from 'body-parser';

import { config } from '../config';

import passport from 'passport';
import cors from 'cors';

import UserController from './User/user.controller';
import GoodController from './Good/good.controller';
import CustomerController from './Customer/customer.controller';
import ManufacturingController from './Manufacturing/manufacturing.controller';
import OrderController from './Order/order.controller';

// Start the server
const port = config.port;

const app = new App({
    port: port,
    controllers: [
        new UserController(),
        new GoodController(),
        new ManufacturingController(),
        new CustomerController(),
        new OrderController()
    ],
    middleWares: [
        cors(),
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        accessLogger,
        passport.initialize()
    ]
});

app.listen();
