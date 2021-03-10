import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import request from 'supertest';
import 'mocha';
import * as bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

import App from '../../src/app';
import PlanningService from '../../src/Planning/planning.service';
import PlanningController from '../../src/Planning/planning.controller';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;
const testPort = 5001;
const payload = {
    userId: 1,
    name: 'Fake Name',
    role: 'Fake Role'
};
const token = jwt.sign(payload, config.jwt_public_key, { expiresIn: '1d' });

describe('Planning Controller Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test get all events route', async () => {
        const mockPlanningService = sandbox.createStubInstance(PlanningService);
        mockPlanningService.getAllEvents.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new PlanningController(mockPlanningService)],
            middleWares: []
        });
        app.listen();
        const res = await request(app.app)
            .get('/planning/events')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test post an event', async () => {
        const mockPlanningService = sandbox.createStubInstance(PlanningService);
        mockPlanningService.addEvent.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new PlanningController(mockPlanningService)],
            middleWares: []
        });
        app.listen();
        const res = await request(app.app)
            .post('/planning/events')
            .send({
                "date": "2021-04-10",
                "time": "9:00:00",
                "title": "test event"
            })
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test delete an event', async () => {
        const mockPlanningService = sandbox.createStubInstance(PlanningService);
        mockPlanningService.deleteEvent.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new PlanningController(mockPlanningService)],
            middleWares: []
        });
        app.listen();
        const res = await request(app.app)
            .delete('/planning/events/1')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });
});