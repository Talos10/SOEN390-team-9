import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import 'mocha';
import bcrypt from 'bcrypt';
import { config } from '../../config';

import CustomerService from '../../src/Customer/customer.service';
import CustomerModel from '../../src/Customer/customer.models';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;

const mockCustomer = {
    name: 'john',
    email: 'doe'
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

describe('Customer Service Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test get all customers', async () => {
        const customerService = new CustomerService();
        sandbox.stub(CustomerModel, 'getAll').resolves('foo');
        const res = await customerService.getAllCustomers();
        expect(res).to.equal('foo');
    });

    it('Test get top 3 customers', async () => {
        const customerService = new CustomerService();
        sandbox.stub(CustomerModel, 'getTop3Customers').resolves('foo');
        const res = await customerService.getTop3Customers();
        expect(res).to.equal('foo');
    });

    it('Test create new customer', async () => {
        const customerService = new CustomerService();
        sandbox.stub(CustomerModel, 'addCustomer').resolves('foo');
        const res = await customerService.createNewCustomer(mockCustomer.name, mockCustomer.email);
        expect(res).to.equal('foo');
    });

    it('Test find customer by ID', async () => {
        const customerService = new CustomerService();
        sandbox.stub(CustomerModel, 'findById').resolves('foo');
        const res = await customerService.findCustomerById(1);
        expect(res).to.equal('foo');
    });

    it('Test update customer by ID', async () => {
        const customerService = new CustomerService();
        sandbox.stub(CustomerModel, 'updateById').resolves('foo');
        const res = await customerService.updateCustomer(1, mockCustomer.name, mockCustomer.email);
        expect(res).to.equal('foo');
    });

    it('Test get all archived customers', async () => {
        const customerService = new CustomerService();
        sandbox.stub(CustomerModel, 'getAllArchived').resolves('foo');
        const res = await customerService.getAllArchivedCustomers(true);
        expect(res).to.equal('foo');
    });
});
