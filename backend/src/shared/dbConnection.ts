import { config } from '../../config';

//creating a connection to local db and then testing it
const connection = require('knex')({
    client: 'mysql',
    connection: {
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name,
        port: config.database.port
    }
});

export default connection
