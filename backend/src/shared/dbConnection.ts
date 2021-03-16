import { config } from '../../config';
import logger from './Logger';
import MockConnection from '../../test/others/mySqlMock';


const get_connection = () => {
    let connection: any;
    //creating a connection to local db and then testing it
    try {
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
        } else {
            connection = new MockConnection();
        }
    }
    catch(e) {
        logger.error('Error while trying to connect to database');
        throw e;
    }
    return connection
}

export default get_connection;
