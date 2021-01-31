import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import request from 'supertest';
import 'mocha';
import * as bodyParser from 'body-parser'

import App from '../../src/app';
import UserService from '../../src/User/user.service';
import UserController from '../../src/User/user.controller';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;

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
        port: 5000,
        controllers: [
            new UserController(mockUserService)
        ],
        middleWares: []
    });
    
    app.listen();
    const res = await request(app.app).get('/');
    expect(res.text).to.equal('Backend is running');
    expect(res.status).to.equal(200);
    app.shutdown();
  });

  it('Test get all user route', async () => {
    const mockUserService = sandbox.createStubInstance(UserService);
    mockUserService.getAllUsers.resolves('foo');
    const app = new App({
        port: 5000,
        controllers: [
            new UserController(mockUserService)
        ],
        middleWares: []
    });
    
    app.listen();
    const res = await request(app.app).get('/user/');
    expect(res.body).to.equal('foo');
    expect(res.status).to.equal(200);
    app.shutdown();
  });

  it('Test create new user route', async () => {
    const mockUserService = sandbox.createStubInstance(UserService);
    mockUserService.createNewUser.resolves('foo');
    const app = new App({
        port: 5000,
        controllers: [
            new UserController(mockUserService)
        ],
        middleWares: [
            bodyParser.json(),
            bodyParser.urlencoded({ extended: true }),
        ]
    });
    app.listen();
    const res = await request(app.app)
                        .post('/user/')
                        .set('Accept', 'application/json')
                        .send({
                            name: 'john',
                            email: 'doe',
                            role: 'admin',
                            passowrd: '123'
                        })
    expect(res.body).to.equal('foo');
    expect(res.status).to.equal(200);
    app.shutdown();
  });

});