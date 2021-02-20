import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import 'mocha';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import UserService from '../../src/User/user.service';
import UserModel from '../../src/User/user.models';
import emailService from '../../src/Email/email.service';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;

const mockUser = {
    name: 'john',
    email: 'doe',
    role: 'admin',
    password: '123'
};
const mockUserFromDb = {
    userId: 1,
    name: 'john',
    email: 'doe',
    role: 'admin',
    password: bcrypt.hashSync('password', config.bcrypt_salt),
    resetPasswordToken: null,
    resetPasswordExpires: null
};

const createErrorReturn = (status: boolean, error: string) => {
    return {
        status: status,
        error: error
    };
};

const createSuccessReturn = (status: boolean, message: string) => {
    return {
        status: status,
        message: message
    };
};

describe('User Service Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test login user with invalid authorization header', async () => {
        const userService = new UserService();
        const res = await userService.loginUser(undefined, 'password');
        expect(JSON.stringify(res)).to.equal(
            JSON.stringify(createErrorReturn(false, 'Invalid authorization header'))
        );
        const res2 = await userService.loginUser('email', undefined);
        expect(JSON.stringify(res2)).to.equal(
            JSON.stringify(createErrorReturn(false, 'Invalid authorization header'))
        );
    });

    it('Test login if user does not exist', async () => {
        const userService = new UserService();
        sandbox.stub(UserModel, 'findByEmailAuth').resolves(undefined);
        const res = await userService.loginUser('email', 'password');
        expect(JSON.stringify(res)).to.equal(
            JSON.stringify(createErrorReturn(false, 'User does not exist'))
        );
    });

    it('Test login if user exist but password dont match', async () => {
        const userService = new UserService();
        sandbox.stub(UserModel, 'findByEmailAuth').resolves(mockUserFromDb);
        const res = await userService.loginUser('email', 'badPassword');
        expect(JSON.stringify(res)).to.equal(
            JSON.stringify(createErrorReturn(false, 'Wrong password'))
        );
    });

    it('Test login if user exist and password match', async () => {
        const userService = new UserService();
        sandbox.stub(UserModel, 'findByEmailAuth').resolves(mockUserFromDb);
        const res = await userService.loginUser('email', 'password');
        const payload = {
            id: mockUserFromDb.userId,
            role: mockUserFromDb.role
        };
        const expected = {
            status: true,
            name: mockUserFromDb.name,
            token: jwt.sign(payload, config.jwt_public_key, { expiresIn: '1d' })
        };
        expect(JSON.stringify(res)).to.equal(JSON.stringify(expected));
    });

    it('Test forgot if email dont match', async () => {
        const userService = new UserService();
        sandbox.stub(UserModel, 'findByEmailAuth').resolves(undefined);
        const res = await userService.sendForgotPassword('email');
        expect(JSON.stringify(res)).to.equal(
            JSON.stringify(createErrorReturn(false, 'Email does not match any account.'))
        );
    });

    it('Test forgot but error in sending email', async () => {
        const userService = new UserService();
        sandbox.stub(UserModel, 'findByEmailAuth').resolves(mockUserFromDb);
        sandbox.stub(UserModel, 'updateById');
        sandbox.stub(emailService, 'sendPasswordRecoveryEmail').returns(false);
        const res = await userService.sendForgotPassword('email');
        expect(JSON.stringify(res)).to.equal(
            JSON.stringify(
                createErrorReturn(
                    false,
                    `Error in sending email to ${mockUserFromDb.email}. Please contact your administrator`
                )
            )
        );
    });

    it('Test forgot email and sending is optimal', async () => {
        const userService = new UserService();
        sandbox.stub(UserModel, 'findByEmailAuth').resolves(mockUserFromDb);
        sandbox.stub(UserModel, 'updateById');
        sandbox.stub(emailService, 'sendPasswordRecoveryEmail').returns(true);
        const res = await userService.sendForgotPassword('email');
        expect(JSON.stringify(res)).to.equal(
            JSON.stringify(
                createSuccessReturn(
                    true,
                    `An email has been sent to ${mockUserFromDb.email} with further instructions.`
                )
            )
        );
    });

    it('Test reset password with invalid authorization header', async () => {
        const userService = new UserService();
        const res = await userService.resetPassword(undefined, 'password');
        expect(JSON.stringify(res)).to.equal(
            JSON.stringify(createErrorReturn(false, 'Invalid authorization header'))
        );
        const res2 = await userService.resetPassword('token', undefined);
        expect(JSON.stringify(res2)).to.equal(
            JSON.stringify(createErrorReturn(false, 'Invalid authorization header'))
        );
    });

    it('Test reset password with invalid token', async () => {
        const userService = new UserService();
        sandbox.stub(UserModel, 'findByResetPasswordToken').resolves(undefined);
        const res = await userService.resetPassword('token', 'password');
        expect(JSON.stringify(res)).to.equal(
            JSON.stringify(
                createErrorReturn(false, 'Reset password token is invalid or has expired.')
            )
        );
    });

    it('Test reset password with invalid token', async () => {
        const userService = new UserService();
        sandbox.stub(UserModel, 'findByResetPasswordToken').resolves(mockUserFromDb);
        sandbox.stub(UserModel, 'updateById');
        const res = await userService.resetPassword('token', 'password');
        expect(JSON.stringify(res)).to.equal(
            JSON.stringify(
                createSuccessReturn(
                    true,
                    'Password has been changed successfully. You can log in again with that password.'
                )
            )
        );
    });

    it('Test get all users', async () => {
        const userService = new UserService();
        sandbox.stub(UserModel, 'getAll').resolves('foo');
        const res = await userService.getAllUsers();
        expect(res).to.equal('foo');
    });

    it('Test create new user', async () => {
        const userService = new UserService();
        sandbox.stub(UserModel, 'addUser').resolves('foo');
        const res = await userService.createNewUser(
            mockUser.name,
            mockUser.role,
            mockUser.email,
            mockUser.password
        );
        expect(res).to.equal('foo');
    });

    it('Test find user by ID', async () => {
        const userService = new UserService();
        sandbox.stub(UserModel, 'findById').resolves('foo');
        const res = await userService.findUserById(1);
        expect(res).to.equal('foo');
    });

    it('Test update user by ID', async () => {
        const userService = new UserService();
        sandbox.stub(UserModel, 'updateById').resolves('foo');
        const res = await userService.updateUser(
            1,
            mockUser.name,
            mockUser.role,
            mockUser.email,
            mockUser.password
        );
        expect(res).to.equal('foo');
    });

    it('Test delete user by ID', async () => {
        const userService = new UserService();
        sandbox.stub(UserModel, 'deleteUser').resolves('foo');
        const res = await userService.deleteUser(1);
        expect(res).to.equal('foo');
    });

    it('Test delete all users', async () => {
        const userService = new UserService();
        sandbox.stub(UserModel, 'deleteAll').resolves('foo');
        const res = await userService.deleteAll();
        expect(res).to.equal('foo');
    });
});
