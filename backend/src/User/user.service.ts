import UserModel from './user.models';
import { config } from '../../config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import emailService from '../Email/email.service';

class Service {
    public async loginUser(email?: string, password?: string) {
        if (!email || !password) {
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
            };
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

    public async sendForgotPassword(email: string) {
        const user = await UserModel.findByEmailAuth(email);
        if (!user) {
            return { status: false, error: 'Email does not match any account.' };
        }

        // Create token that expires in 1 hour
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        UserModel.updateById(user.userId, user);

        const success = emailService.sendPasswordRecoveryEmail(user.email, token);
        if (!success) {
            return {
                status: false,
                error: `Error in sending email to ${user.email}. Please contact your administrator`
            };
        }
        return {
            status: true,
            message: `An email has been sent to ${user.email} with further instructions.`
        };
    }

    public async resetPassword(token?: string, password?: string) {
        if (!token || !password) {
            return { status: false, error: 'Invalid authorization header' };
        }
        const user = await UserModel.findByResetPasswordToken(token);
        console.log(user);
        if (!user) {
            return {
                status: false,
                error: 'Reset password token is invalid or has expired.'
            };
        }
        user.password = bcrypt.hashSync(password, config.bcrypt_salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        UserModel.updateById(user.userId, user);

        return {
            status: true,
            message:
                'Password has been changed successfully. You can log in again with that password.'
        };
    }

    public async getAllUsers(): Promise<UserModel[]> {
        const allUsers = await UserModel.getAll();
        return allUsers;
    }

    public async createNewUser(
        name: string,
        role: string,
        email: string,
        password: string
    ): Promise<number> {
        const newUser = new UserModel({
            name: name,
            role: role,
            email: email,
            password: bcrypt.hashSync(password, config.bcrypt_salt)
        });

        try {
            return await UserModel.addUser(newUser);
        } catch (e) {
            return Promise.reject(
                'The given email address is currently in use by another user. Please enter a different one.'
            );
        }
    }

    public async findUserById(id: number): Promise<UserModel> {
        const user = await UserModel.findById(id);
        return user;
    }

    public async updateUser(
        id: number,
        name: string,
        role: string,
        email: string,
        password: string
    ): Promise<number> {
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
