import connection from '@shared/dbConnection';
import helper from '../shared/Helper';

class User {
    public name: string;
    public role: string;
    public email: string;
    public password: string;

    constructor(user: { name: string; role: string; email: string; password: string; }) {
        this.name = user.name;
        this.role = user.role;
        this.email = user.email;
        this.password = user.password;
    }

    public static async getAll() {
        const query = 'SELECT userID, name, role, email FROM user';
        const result = await helper.doQuery(query);
        return result;
    }

    public static async addUser(user: User) {
        const query = 'INSERT INTO user SET ?';
        const result = await helper.doQueryParams(query, user);
        return result;
    }

    public static async findById(userID: number) {
        const query = `SELECT userID, name, role, email FROM user WHERE userID = ${userID}`;
        const result = await helper.doQuery(query);
        return result[0];
    }

    public static async findByIdAuth(email: string, password: string) {
        const query = 'SELECT userID, name, role, email FROM user WHERE email = ? AND password = ?';
        const result = await helper.doQueryParams(query, [email, password]);
        return result[0];
    }

    public static async updateById(userID: number, user: User) {
        const query = 'UPDATE user SET name = ?, role = ?, email = ?, password = ? WHERE userID = ?'
        const result = await helper.doQueryParams(query,
            [user.name, user.role, user.email, user.password, userID]);
        return result;

    }

    public static async deleteUser(userId: number) {
        const query = 'DELETE FROM user WHERE userID = ?'
        const result = await helper.doQueryParams(query, userId);
        return result[0];
    }

    public static async deleteAll() {
        const query = 'DELETE FROM user';
        const result = await helper.doQuery(query);
        await helper.doQuery('ALTER TABLE user AUTO_INCREMENT = 1');
        return result;
    }
}

export default User;