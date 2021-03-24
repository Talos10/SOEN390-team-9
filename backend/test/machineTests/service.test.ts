import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import 'mocha';
import MachineService from '../../src/Machine/machine.service';
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

    it('Test delete machine by ID', async () => {
        const machineService = new MachineService();
        sandbox.stub(MachineModel, 'deleteMachine').resolves('foo');
        const res = await machineService.deleteMachine(1);
        expect(res).to.equal('foo');
    });

    it('Test delete all machines', async () => {
        const machineService = new MachineService();
        sandbox.stub(MachineModel, 'deleteAll').resolves('foo');
        const res = await machineService.deleteAll();
        expect(res).to.equal('foo');
    });
});
