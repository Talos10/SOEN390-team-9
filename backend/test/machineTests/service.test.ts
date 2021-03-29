import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import 'mocha';
import MachineService from '../../src/Machine/machine.service';
import ScheduleService from '../../src/Schedule/schedule.service';
import MachineModel from '../../src/Machine/machine.models';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;

const mockMachine = {
    status: 'free',
    numberOrderCompleted: 0
};

describe('Machine Service Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test get all machines', async () => {
        const machineService = new MachineService();
        sandbox.stub(MachineModel, 'getAll').resolves('foo');
        const res = await machineService.getAllMachines();
        expect(res).to.equal('foo');
    });

    it('Test get all machines by status', async () => {
        const machineService = new MachineService();
        sandbox.stub(MachineModel, 'getAllByStatus').resolves('foo');
        const res = await machineService.getAllMachinesByStatus('free');
        expect(res).to.equal('foo');
    });

    it('Test create new machine', async () => {
        const machineService = new MachineService();
        sandbox.stub(MachineModel, 'addMachine').resolves('foo');
        const res = await machineService.createNewMachine();
        expect(res).to.equal('foo');
    });

    it('Test find machine by ID', async () => {
        const machineService = new MachineService();
        sandbox.stub(MachineModel, 'findById').resolves('foo');
        const res = await machineService.findMachineById(1);
        expect(res).to.equal('foo');
    });

    it('Test update machine by ID', async () => {
        const machineService = new MachineService();
        sandbox.stub(MachineModel, 'updateById').resolves('foo');
        const res = await machineService.updateMachine(
            1,
            mockMachine.status,
            mockMachine.numberOrderCompleted
        );
        expect(res).to.equal('foo');
    });

    it('Test create new schedule machine is busy', async () => {
        const mockScheduleService = sandbox.createStubInstance(ScheduleService);
        const machineService = new MachineService(mockScheduleService);
        sandbox
            .stub(machineService, 'findMachineById')
            .resolves({ status: 'busy', machineId: 1, numberOrderCompleted: 1 });
        const res = await machineService.scheduleMachine(1, 1);
        expect(res.message).to.equal('Machine does not exist or is not available');
        expect(res.status).to.equal(false);
    });

    it('Test create new schedule machine is not found', async () => {
        const mockScheduleService = sandbox.createStubInstance(ScheduleService);
        const machineService = new MachineService(mockScheduleService);
        sandbox.stub(machineService, 'findMachineById').resolves(null);
        const res = await machineService.scheduleMachine(1, 1);
        expect(res.message).to.equal('Machine does not exist or is not available');
        expect(res.status).to.equal(false);
    });

    it('Test create new schedule machine schedule fails', async () => {
        const mockScheduleService = sandbox.createStubInstance(ScheduleService);
        const machineService = new MachineService(mockScheduleService);
        sandbox
            .stub(machineService, 'findMachineById')
            .resolves({ status: 'free', machineId: 1, numberOrderCompleted: 1 });
        mockScheduleService.createNewSchedule.resolves({ status: false, message: 'foo' });
        const res = await machineService.scheduleMachine(1, 1);
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(false);
    });

    it('Test create new schedule machine schedule fails', async () => {
        const mockScheduleService = sandbox.createStubInstance(ScheduleService);
        const machineService = new MachineService(mockScheduleService);
        sandbox
            .stub(machineService, 'findMachineById')
            .resolves({ status: 'free', machineId: 1, numberOrderCompleted: 1 });
        sandbox
            .stub(machineService, 'updateMachine')
            .resolves({ status: 'free', machineId: 1, numberOrderCompleted: 1 });
        mockScheduleService.createNewSchedule.resolves({ status: true, message: 'foo' });
        const res = await machineService.scheduleMachine(1, 1);
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test complete schedule machine is free', async () => {
        const mockScheduleService = sandbox.createStubInstance(ScheduleService);
        const machineService = new MachineService(mockScheduleService);
        sandbox
            .stub(machineService, 'findMachineById')
            .resolves({ status: 'free', machineId: 1, numberOrderCompleted: 1 });
        const res = await machineService.freeMachine(1, 1);
        expect(res.message).to.equal('Machine does not exist or is already free');
        expect(res.status).to.equal(false);
    });

    it('Test complete schedule machine is not found', async () => {
        const mockScheduleService = sandbox.createStubInstance(ScheduleService);
        const machineService = new MachineService(mockScheduleService);
        sandbox.stub(machineService, 'findMachineById').resolves(null);
        const res = await machineService.freeMachine(1, 1);
        expect(res.message).to.equal('Machine does not exist or is already free');
        expect(res.status).to.equal(false);
    });

    it('Test complete schedule machine schedule fails', async () => {
        const mockScheduleService = sandbox.createStubInstance(ScheduleService);
        const machineService = new MachineService(mockScheduleService);
        sandbox
            .stub(machineService, 'findMachineById')
            .resolves({ status: 'busy', machineId: 1, numberOrderCompleted: 1 });
        mockScheduleService.completeSchedule.resolves({ status: false, message: 'foo' });
        const res = await machineService.freeMachine(1, 1);
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(false);
    });

    it('Test complete schedule machine', async () => {
        const mockScheduleService = sandbox.createStubInstance(ScheduleService);
        const machineService = new MachineService(mockScheduleService);
        sandbox
            .stub(machineService, 'findMachineById')
            .resolves({ status: 'busy', machineId: 1, numberOrderCompleted: 1 });
        sandbox
            .stub(machineService, 'updateMachine')
            .resolves({ status: 'free', machineId: 1, numberOrderCompleted: 1 });
        mockScheduleService.completeSchedule.resolves({ status: true, message: 'foo' });
        const res = await machineService.freeMachine(1, 1);
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });
});
