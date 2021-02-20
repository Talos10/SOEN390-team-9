const config = {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 5000),
    database: {
        host: process.env.MYSQL_HOSTNAME || '127.0.0.1',
        user: process.env.MYSQL_USER || 'admin',
        password: process.env.MYSQL_PASSWORD || 'admin',
        name: process.env.MYSQL_DATABASE || 'soen_390_db',
        port: Number(process.env.MYSQL_PORT || 3306)
    },
    jwt_public_key: process.env.JWT_PUBLIC_KEY || 'NL5U0AbuR5RE7mDRWFWMUh5ArPa0WGww',
    logger: {
        level: process.env.LOG_LEVEL || 'debug'
    },
    user: {
        role: {
            admin: 'Admin',
            user: 'User'
        }
    },
    good: {
        types: ['raw', 'semi-finished', 'finished']
    },
    manufacturing: {
        status: {
            complete: 'completed',
            process: 'processing'
        }
    }
};

export { config };
