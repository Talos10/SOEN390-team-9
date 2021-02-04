import { config } from '../../config';
import logger from './Logger';
import MockConnection from '../../test/others/mySqlMock';

let connection: any;
//creating a connection to local db and then testing it

if (config.env === 'development' || config.env === 'production') {
    connection = require('knex')({
        client: 'mysql',
        connection: {
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            database: config.database.name,
            port: config.database.port
        }
    });
    logger.info('Database Connection Started')
} else {
    connection = new MockConnection();
}

export default connection
