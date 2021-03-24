import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import request from 'supertest';
import 'mocha';
import * as bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

import App from '../../src/app';
import MachineService from '../../src/Machine/machine.service';
import MachineController from '../../src/Machine/machine.controller';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;
const testPort = 5001;
const payload = {
    machineId: 1,
    name: 'Fake Name',
    role: 'Fake Role'
};
const mockMachine = {
    status: 'free',
    numberOrderCompleted: '0'
};

const token = jwt.sign(payload, config.jwt_public_key, { expiresIn: '1d' });

describe('Machine Controller Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test get all machines', async () => {
        const mockMachineService = sandbox.createStubInstance(MachineService);
        mockMachineService.getAllMachines.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new MachineController(mockMachineService)],
            middleWares: []
        });

        app.listen();
        const res = await request(app.app)
            .get('/machine/')
            .set('Accept', 'application/json')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test get all machines by status', async () => {
        const mockMachineService = sandbox.createStubInstance(MachineService);
        mockMachineService.getAllMachinesByStatus.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new MachineController(mockMachineService)],
            middleWares: []
        });

        app.listen();
        const res = await request(app.app)
            .get('/machine/filter/free')
            .set('Accept', 'application/json')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });

    it('Test create new machine route', async () => {
        const mockMachineService = sandbox.createStubInstance(MachineService);
        mockMachineService.createNewMachine.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new MachineController(mockMachineService)],
            middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })]
        });
        app.listen();
        const res = await request(app.app)
            .post('/machine/')
            .set('Accept', 'application/json')
            .set('Authorization', 'bearer ' + token);
        expect(res.body.id).to.equal('foo');
        expect(res.status).to.equal(200);
        console.log('res.body: ', res.body);
        app.shutdown();
    });

    it('Test find machine by ID route', async () => {
        const mockMachineService = sandbox.createStubInstance(MachineService);
        mockMachineService.findMachineById.resolves('foo');
        const app = new App({
            port: testPort,
            controllers: [new MachineController(mockMachineService)],
            middleWares: []
        });

        app.listen();
        const res = await request(app.app)
            .get('/machine/:machineId')
            .set('Authorization', 'bearer ' + token);
        expect(res.body).to.equal('foo');
        expect(res.status).to.equal(200);
        app.shutdown();
    });
});
