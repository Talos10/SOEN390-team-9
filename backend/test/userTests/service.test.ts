import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import request from 'supertest';
import 'mocha';

import UserService from '../../src/User/user.service';
import UserModel from '../../src/User/user.model';


sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;

describe('User Controller Test', () => {
  
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
});