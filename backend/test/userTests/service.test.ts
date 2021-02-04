import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import request from 'supertest';
import 'mocha';

import UserService from '../../src/User/user.service';
import UserModel from '../../src/User/user.model';


sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;
const mockUser = {
  name: 'john',
  email: 'doe',
  role: 'admin',
  password: '123'
};

describe('User Service Test', () => {
  
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
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
    const res = await userService.createNewUser(mockUser.name, mockUser.role, mockUser.email, mockUser.password);
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
    const res = await userService.updateUser(1, mockUser.name, mockUser.role, mockUser.email, mockUser.password);
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