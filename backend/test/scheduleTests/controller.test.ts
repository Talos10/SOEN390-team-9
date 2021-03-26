import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import request from 'supertest';
import 'mocha';
import * as bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

import App from '../../src/app';
import ScheduleService from '../../src/Schedule/schedule.service';
import ScheduleController from '../../src/Schedule/schedule.controller';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;
const testPort = 5001;
const payload = {
    machineId: 1,
    name: 'Fake Name',
    role: 'Fake Role'
};

const token = jwt.sign(payload, config.jwt_public_key, { expiresIn: '1d' });

describe('Schedule Controller Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test get all schedule route', async () => {
        const scheduleService = sandbox.createStubInstance(ScheduleService);
        scheduleService.getAllSchedule.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new ScheduleController(scheduleService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });

        app.listen();
        const res = await request(app.app)
            .get('/schedule')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });
});
