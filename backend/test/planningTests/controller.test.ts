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
const mockGoal = {
    completed: false,
    targetDate: new Date('2022-01-01'),
    title: 'test goal'
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

    it('Test get all goals route', async () => {
        const mockPlanningService = sandbox.createStubInstance(PlanningService);
        mockPlanningService.getAllGoals.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new PlanningController(mockPlanningService)],
            middleWares: []
        });
        app.listen();
        const res = await request(app.app)
            .get('/planning/goals/')
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
                date: '2021-04-10',
                time: '9:00:00',
                title: 'test event'
            })
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test post a goal', async () => {
        const mockPlanningService = sandbox.createStubInstance(PlanningService);
        mockPlanningService.addGoal.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new PlanningController(mockPlanningService)],
            middleWares: []
        });
        app.listen();
        const res = await request(app.app)
            .post('/planning/goals')
            .send({
                completed: 0,
                targetDate: '2021-11-06',
                title: 'Sell 500 bikes'
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

    it('Test delete a goal', async () => {
        const mockPlanningService = sandbox.createStubInstance(PlanningService);
        mockPlanningService.deleteGoal.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new PlanningController(mockPlanningService)],
            middleWares: []
        });
        app.listen();
        const res = await request(app.app)
            .delete('/planning/goals/1')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test modify a goal', async () => {
        const mockPlanningService = sandbox.createStubInstance(PlanningService);
        mockPlanningService.updateGoal.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new PlanningController(mockPlanningService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .put('/planning/goals/:goalId')
            .set('Accept', 'application/json')
            .send(mockGoal)
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });
});
