
import * as mysql from 'mysql';
import { config } from '../../config';
import logger from './Logger';

//creating a connection to local db and then testing it
const connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    port: config.database.port
});

//open the MySQL connection
connection.connect((error: any) => {
    if (error) throw error;
    logger.info('Successfully connected to the database.');
});


export default connection
