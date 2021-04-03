import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import request from 'supertest';
import 'mocha';
import * as bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

import App from '../../src/app';
import OrderService from '../../src/Order/order.service';
import OrderController from '../../src/Order/order.controller';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;
const testPort = 5001;
const payload = {
    userId: 1,
    name: 'Fake Name',
    role: 'Fake Role'
};
const token = jwt.sign(payload, config.jwt_public_key, { expiresIn: '1d' });

describe('Customer Order Controller Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test get all orders route', async () => {
        const mockOrderService = sandbox.createStubInstance(OrderService);
        mockOrderService.getAllOrders.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new OrderController(mockOrderService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/order/')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test get order by id route', async () => {
        const mockOrderService = sandbox.createStubInstance(OrderService);
        mockOrderService.getOrderById.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new OrderController(mockOrderService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/order/id/1')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test get order by customer id route', async () => {
        const mockOrderService = sandbox.createStubInstance(OrderService);
        mockOrderService.getOrderByCustomerId.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new OrderController(mockOrderService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/order/customer/id/1')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test get order by status route', async () => {
        const mockOrderService = sandbox.createStubInstance(OrderService);
        mockOrderService.getOrderByOrderStatus.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new OrderController(mockOrderService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/order/status/bob')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test get total income', async () => {
        const mockOrderService = sandbox.createStubInstance(OrderService);
        mockOrderService.getIncome.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new OrderController(mockOrderService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/order/income')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test get total income per month', async () => {
        const mockOrderService = sandbox.createStubInstance(OrderService);
        mockOrderService.getIncomePerMonth.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new OrderController(mockOrderService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/order/income/month')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test create order route', async () => {
        const mockOrderService = sandbox.createStubInstance(OrderService);
        mockOrderService.createNewOrder.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new OrderController(mockOrderService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .post('/order/')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify([{ id: 1, archive: true }]))
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Update order status route', async () => {
        const mockOrderService = sandbox.createStubInstance(OrderService);
        mockOrderService.updateStatusOfOrdersInBulk.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new OrderController(mockOrderService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .put('/order/complete')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify([{ id: 1, archive: true }]))
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });
});
