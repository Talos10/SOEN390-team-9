import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import 'mocha';
import ManufacturingService from '../../src/Manufacturing/manufacturing.service';
import ScheduleService from '../../src/Schedule/schedule.service';
import { Schedule as ScheduleModel } from '../../src/Schedule/schedule.models';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;

describe('Machine Service Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test create new schedule order not found', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        const scheduleService = new ScheduleService(mockManufacturingService);

        mockManufacturingService.getOrderFromId.resolves({ status: false, message: 'foo' });

        const res = await scheduleService.createNewSchedule(1, 1);
        expect(res.message).to.equal('Unable to find order');
        expect(res.status).to.equal(false);
    });

    it('Test create new schedule order not confirmed', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        const scheduleService = new ScheduleService(mockManufacturingService);

        mockManufacturingService.getOrderFromId.resolves({
            status: true,
            message: { status: 'cancelled' }
        });

        const res = await scheduleService.createNewSchedule(1, 1);
        expect(res.message).to.equal('Order is not confirmed');
        expect(res.status).to.equal(false);
    });

    it('Test create new schedule order update fails', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        const scheduleService = new ScheduleService(mockManufacturingService);

        mockManufacturingService.getOrderFromId.resolves({
            status: true,
            message: { status: 'confirmed' }
        });
        mockManufacturingService.updateSingleOrderStatus.resolves({
            status: false,
            message: 'foo'
        });
        sandbox.stub(ScheduleModel.prototype, 'save').resolves(true);
        const res = await scheduleService.createNewSchedule(1, 1);
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(false);
    });

    it('Test create new schedule order success', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        const scheduleService = new ScheduleService(mockManufacturingService);

        mockManufacturingService.getOrderFromId.resolves({
            status: true,
            message: { status: 'confirmed' }
        });
        mockManufacturingService.updateSingleOrderStatus.resolves({ status: true, message: 'foo' });
        sandbox.stub(ScheduleModel.prototype, 'save').resolves(true);
        const res = await scheduleService.createNewSchedule(1, 1);
        expect(res.message).to.equal('Successfully saved new schedule');
        expect(res.status).to.equal(true);
    });

    it('Test create new schedule order crash', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        const scheduleService = new ScheduleService(mockManufacturingService);

        mockManufacturingService.getOrderFromId.resolves({
            status: true,
            message: { status: 'confirmed' }
        });
        mockManufacturingService.updateSingleOrderStatus.resolves({ status: true, message: 'foo' });
        sandbox.stub(ScheduleModel.prototype, 'save').throws(new Error());
        const res = await scheduleService.createNewSchedule(1, 1);
        expect(res.message).to.equal('Failed to save new schedule');
        expect(res.status).to.equal(false);
    });

    it('Test delete schedule order update fails', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        const scheduleService = new ScheduleService(mockManufacturingService);

        mockManufacturingService.updateSingleOrderStatus.resolves({
            status: false,
            message: 'foo'
        });
        sandbox.stub(ScheduleModel.prototype, 'delete').resolves(true);
        const res = await scheduleService.completeSchedule(1, 1);
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(false);
    });

    it('Test delete schedule order success', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        const scheduleService = new ScheduleService(mockManufacturingService);

        mockManufacturingService.updateSingleOrderStatus.resolves({ status: true, message: 'foo' });
        sandbox.stub(ScheduleModel.prototype, 'delete').resolves(true);
        const res = await scheduleService.completeSchedule(1, 1);
        expect(res.message).to.equal('Successfully deleted schedule');
        expect(res.status).to.equal(true);
    });

    it('Test delete schedule order crash', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        const scheduleService = new ScheduleService(mockManufacturingService);

        mockManufacturingService.updateSingleOrderStatus.resolves({ status: true, message: 'foo' });
        sandbox.stub(ScheduleModel.prototype, 'delete').throws(new Error());
        const res = await scheduleService.completeSchedule(1, 1);
        expect(res.message).to.equal('Failed to delete schedule');
        expect(res.status).to.equal(false);
    });

    it('Test get all schedule', async () => {
        const mockManufacturingService = sandbox.createStubInstance(ManufacturingService);
        const scheduleService = new ScheduleService(mockManufacturingService);

        sandbox.stub(ScheduleModel, 'getAllSchedules').resolves(['foo']);
        const res = await scheduleService.getAllSchedule();
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });
});
