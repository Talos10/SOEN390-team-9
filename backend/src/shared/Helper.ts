import database from './dbConnection';
import logger from './Logger';

class Helper {
    public doQuery(query: any): any {
        const promise = new Promise((resolve, reject) => {
            database.query(query, (err: any, res: any[]) => {
                if (err) {
                    logger.err(`Error while calling the following query: ${query}`, err);
                    throw err;
                }
                resolve(res);
            });
        });
        return promise.then((val) => {
            return val;
        });
    }

    public doQueryParams(query: any, arr: any): any {
        const promise = new Promise((resolve, reject) => {
            database.query(query, arr, (err: any, res: any[]) => {
                if (err) {
                    logger.err(`Error while calling the following query: ${query}`, err);
                    throw err;
                }
                resolve(res);
            });
        });
        return promise.then((val) => {
            return val;
        });
    }
}

export default new Helper();
