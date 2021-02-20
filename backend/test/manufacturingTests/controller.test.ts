import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import request from 'supertest';
import 'mocha';
import * as bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

import App from '../../src/app';
import ManufacturingService from '../../src/Manufacturing/manufacturing.service';
import GoodService from '../../src/Good/good.service';
import ManufacturingController from '../../src/Manufacturing/manufacturing.controller';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;
const testPort = 5001;
const payload = {
    userId: 1,
    name: 'Fake Name',
    role: 'Fake Role'
};
const token = jwt.sign(payload, config.jwt_public_key, { expiresIn: '1d' });

describe('Manufacturing Controller Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test get all orders route', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        mockManufacturingService.getAllOrders.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new ManufacturingController(mockManufacturingService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/manufacturing/order/')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test get all orders from status route', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        mockManufacturingService.getOrdersWithStatus.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new ManufacturingController(mockManufacturingService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/manufacturing/order/status/123')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test get all orders from id route', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        mockManufacturingService.getOrderFromId.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new ManufacturingController(mockManufacturingService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/manufacturing/order/id/123')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test create all orders from id route', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        mockManufacturingService.createNewOrder.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new ManufacturingController(mockManufacturingService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .post('/manufacturing/order/')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify([{ id: 1, archive: true }]))
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test complete single order', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        mockManufacturingService.markOrdersAsComplete.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new ManufacturingController(mockManufacturingService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .put('/manufacturing/order/complete')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify([{ id: 1, archive: true }]))
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test complete order auto', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        mockManufacturingService.autoCompleteOrders.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new ManufacturingController(mockManufacturingService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .put('/manufacturing/order/complete/auto')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify([{ id: 1, archive: true }]))
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });
});