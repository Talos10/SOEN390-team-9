import * as mysql from 'mysql';
import { config } from '../../config';
import logger from './Logger';
import MockConnection from '../../test/others/mySqlMock';

let connection: any;

if( config.env === 'development' || config.env === 'production') {
    //creating a connection to local db and then testing it
    connection = mysql.createConnection({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name,
        port: config.database.port
    });

    //open the MySQL connection
    connection.connect((error: any) => {
        if (error) {
            logger.error('Failed to connected to the database', ['database'], error);
        }
        else {
            logger.info('Successfully connected to the database.');
        }
    });
}
else {
    connection = new MockConnection();
}

export default connection
