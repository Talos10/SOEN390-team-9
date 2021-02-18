import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import request from 'supertest';
import 'mocha';
import * as bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

import App from '../../src/app';
import UserService from '../../src/User/user.service';
import UserController from '../../src/User/user.controller';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;
const testPort = 5001;
const payload = {
    userId: 1,
    name: 'Fake Name',
    role: 'Fake Role'
};
const mockUser = {
    name: 'john',
    email: 'doe',
    role: 'admin',
    password: '123'
};
const token = jwt.sign(payload, config.jwt_public_key, { expiresIn: '1d' });

describe('User Controller Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test default route', async () => {
        const mockUserService = sandbox.createStubInstance(UserService);
        const app = new App({
            port: testPort,
            controllers: [new UserController(mockUserService)],
            middleWares: []
        });

        app.listen();
        const res = await request(app.app).get('/');
        expect(res.text).to.equal('Backend is running');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test login user route', async () => {
        const mockUserService = sandbox.createStubInstance(UserService);
        mockUserService.loginUser.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new UserController(mockUserService)],
            middleWares: []
        });

        app.listen();
        const res = await request(app.app)
            .post('/user/login/')
            .set('Authorization', 'test@email password');
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test create new user route', async () => {
        const mockUserService = sandbox.createStubInstance(UserService);
        mockUserService.createNewUser.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new UserController(mockUserService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .post('/user/')
            .set('Accept', 'application/json')
            .send(mockUser)
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test find user by ID route', async () => {
        const mockUserService = sandbox.createStubInstance(UserService);
        mockUserService.findUserById.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new UserController(mockUserService)],
            middleWares: []
        });

        app.listen();
        const res = await request(app.app)
            .get('/user/:userID')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test update user route', async () => {
        const mockUserService = sandbox.createStubInstance(UserService);
        mockUserService.updateUser.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new UserController(mockUserService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .put('/user/:userID')
            .set('Accept', 'application/json')
            .send(mockUser)
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test delete user by ID route', async () => {
        const mockUserService = sandbox.createStubInstance(UserService);
        mockUserService.deleteUser.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new UserController(mockUserService)],
            middleWares: []
        });

        app.listen();
        const res = await request(app.app)
            .delete('/user/:userID')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test delete all users route', async () => {
        const mockUserService = sandbox.createStubInstance(UserService);
        mockUserService.deleteAll.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new UserController(mockUserService)],
            middleWares: []
        });

        app.listen();
        const res = await request(app.app)
            .delete('/user/')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });
});
