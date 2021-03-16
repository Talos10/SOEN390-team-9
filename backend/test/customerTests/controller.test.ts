import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import request from 'supertest';
import 'mocha';
import * as bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

import App from '../../src/app';
import CustomerService from '../../src/Customer/customer.service';
import CustomerController from '../../src/Customer/customer.controller';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;

const testPort = 5001;

const payload = {
    userId: 1,
    name: 'Fake Name',
    role: 'Fake Role'
};

const mockCustomer = {
    name: 'john',
    email: 'doe'
};

const badMockCustomer = {
    name: 'john',
    email: undefined
};

const archiveCustomer = {
    id: 1,
    archived: true
};

const token = jwt.sign(payload, config.jwt_public_key, { expiresIn: '1d' });

describe('Customer Controller Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test get all customers', async () => {
        const mockCustomerService = sandbox.createStubInstance(CustomerService);
        mockCustomerService.getAllCustomers.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new CustomerController(mockCustomerService)],
            middleWares: []
        });

        app.listen();
        const res = await request(app.app)
            .get('/customer/')
            .set('Accept', 'application/json')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test create new customer route', async () => {
        const mockCustomerService = sandbox.createStubInstance(CustomerService);
        mockCustomerService.createNewCustomer.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new CustomerController(mockCustomerService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .post('/customer/')
            .set('Accept', 'application/json')
            .send(mockCustomer)
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test requireParams on create new customer route', async () => {
        const mockCustomerService = sandbox.createStubInstance(CustomerService);
        mockCustomerService.createNewCustomer.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new CustomerController(mockCustomerService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .post('/customer/')
            .set('Accept', 'application/json')
            .send(badMockCustomer)
            .set('Authorization', 'bearer ' + token);
        expect(res.status).to.equal(400);
        app.shutdown();
    });

    it('Test find customer by ID route', async () => {
        const mockCustomerService = sandbox.createStubInstance(CustomerService);
        mockCustomerService.findCustomerById.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new CustomerController(mockCustomerService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/customer/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test update customer route', async () => {
        const mockCustomerService = sandbox.createStubInstance(CustomerService);
        mockCustomerService.updateCustomer.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new CustomerController(mockCustomerService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .put('/customer/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .send(mockCustomer);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test archive customer route', async () => {
        const mockCustomerService = sandbox.createStubInstance(CustomerService);
        mockCustomerService.archiveCustomer.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new CustomerController(mockCustomerService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .post('/customer/archive')
            .set('Accept', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .send(archiveCustomer);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test return archived customer route', async () => {
        const mockCustomerService = sandbox.createStubInstance(CustomerService);
        mockCustomerService.getAllArchivedCustomers.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new CustomerController(mockCustomerService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/customer/archive/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });
});
