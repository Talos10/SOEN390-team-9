import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import request from 'supertest';
import 'mocha';
import * as bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

import App from '../../src/app';
import GoodService from '../../src/Good/good.service';
import GoodController from '../../src/Good/good.controller';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;
const testPort = 5001;
const payload = {
    userId: 1,
    name: 'Fake Name',
    role: 'Fake Role'
};
const token = jwt.sign(payload, config.jwt_public_key, { expiresIn: '1d' });

describe('Good Controller Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test get all goods route', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        mockGoodService.getAllGoods.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new GoodController(mockGoodService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/good/')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test get by id good route', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        mockGoodService.getSingleGood.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new GoodController(mockGoodService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/good/id/123')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test get by type goods route', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        mockGoodService.getAllGoodsOfType.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new GoodController(mockGoodService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/good/type/123')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test get archive by type goods route', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        mockGoodService.getAllArchivedGoodsOfType.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new GoodController(mockGoodService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/good/archive/type/123')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test get total expenses', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        mockGoodService.getExpense.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new GoodController(mockGoodService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/good/expense')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test get total expense per month', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        mockGoodService.getExpensesPerMonth.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new GoodController(mockGoodService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .get('/good/expense/month')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test post archive goods route', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        mockGoodService.archiveMultipleGoods.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new GoodController(mockGoodService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .post('/good/archive/')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify([{ id: 1, archive: true }]))
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test post new good route', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        mockGoodService.addSingleGood.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new GoodController(mockGoodService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .post('/good/single')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({ foo: 'foo' }))
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test post multiple new goods route', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        mockGoodService.addBulkGoods.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new GoodController(mockGoodService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .post('/good')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify([{ foo: 'foo' }]))
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });
});
