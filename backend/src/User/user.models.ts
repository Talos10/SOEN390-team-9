import { get_connection as db } from '../shared/dbConnection';

class User {
    public userId!: number;
    public name: string;
    public role: string;
    public email: string;
    public password: string;
    public resetPasswordToken?: string;
    public resetPasswordExpires?: number;

    constructor(user: { name: string; role: string; email: string; password: string }) {
        this.name = user.name;
        this.role = user.role;
        this.email = user.email;
        this.password = user.password;
    }

    public static async getAll(): Promise<User[]> {
        return await db()('user').select('userID', 'name', 'role', 'email');
    }

    public static async addUser(user: User): Promise<number> {
        return await db()('user').insert(user);
    }

    public static async findById(userID: number): Promise<User> {
        return await db()('user')
            .select('userId', 'name', 'role', 'email')
            .where('userID', userID)
            .first();
    }

    public static async findByEmailAuth(email: string): Promise<User> {
        return await db()('user')
            .select('userId', 'name', 'role', 'email', 'password')
            .where('email', email)
            .first();
    }

    public static async findByResetPasswordToken(token: string): Promise<User> {
        return await db()('user')
            .select('userId', 'name', 'role', 'email', 'password')
            .where('resetPasswordToken', token)
            .andWhere('resetPasswordExpires', '>=', Date.now())
            .first();
    }

    public static async updateById(userID: number, user: User): Promise<number> {
        return await db()('user')
            .update({
                name: user.name,
                role: user.role,
                email: user.email,
                password: user.password,
                resetPasswordToken: user.resetPasswordToken,
                resetPasswordExpires: user.resetPasswordExpires
            })
            .where('userID', userID);
    }

    public static async deleteUser(userId: number): Promise<number> {
        return await db()('user').where('userID', userId).del();
    }

    public static async deleteAll(): Promise<number> {
        const result = await db()('user').del();
        await db().raw('ALTER TABLE user AUTO_INCREMENT = 1');
        return result;
    }
}

export default User;
