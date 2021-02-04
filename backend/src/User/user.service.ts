import UserModel from './user.model';
import { config } from '../../config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class Service {

    public async loginUser(email: string, password: string) {
        if (email === '' || password === '') {
            return { status: false, error: 'Invalid authorization header' };
        }

        const user = await UserModel.findByEmailAuth(email);

        if (!user) {
            return {
                status: false,
                error: 'User does not exist'
            };
        }

        if (bcrypt.compareSync(password, user.password)) {
            // Return the JWT token
            const payload = {
                id: user.userId,
                role: user.role
            }
            const token = jwt.sign(payload, config.jwt_public_key, { expiresIn: '1d' });
            return {
                status: true,
                name: user.name,
                token: token
            };
        }
        return {
            status: false,
            error: 'Wrong password'
        };
    }

    public async getAllUsers(): Promise<UserModel[]> {
        const allUsers = await UserModel.getAll();
        return allUsers;
    }

    public async createNewUser(name: string, role: string, email: string, password: string): Promise<number> {
        const newUser = new UserModel({
            name: name,
            role: role,
            email: email,
            password: bcrypt.hashSync(password, 10)
        });
        const res = await UserModel.addUser(newUser);
        return res;
    }

    public async findUserById(id: number): Promise<UserModel> {
        const user = await UserModel.findById(id);
        return user;
    }

    public async updateUser(id: number, name: string, role: string, email: string, password: string): Promise<number> {
        const newUser = new UserModel({
            name: name,
            role: role,
            email: email,
            password: password
        });
        const res = await UserModel.updateById(id, newUser);
        return res;
    }

    public async deleteUser(id: number): Promise<number> {
        const res = await UserModel.deleteUser(id);
        return res;
    }

    public async deleteAll(): Promise<number> {
        const res = await UserModel.deleteAll();
        return res;
    }
}

export default Service;
