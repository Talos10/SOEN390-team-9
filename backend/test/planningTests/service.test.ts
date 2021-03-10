import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import 'mocha';

import PlanningService from '../../src/Planning/planning.service';
import {Event} from '../../src/Planning/planning.models';
import {Goal} from '../../src/Planning/planning.models';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;

const mockEvent = {
    id: 6,
    date: new Date('2021-04-10'),
    time: new Date('9:00:00'),
    title: 'test event'
};

const mockGoal = {
    id: 4, 
    completed: false, 
    targetDate: new Date("2022-01-01"),
    title: 'test goal'
}

describe('Planning Service Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test get all events', async () => {
        const planningService = new PlanningService();
        sandbox.stub(Event, 'getAllEvents').resolves('foo');
        const res = await planningService.getAllEvents();
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test get all goals', async () => {
        const planningService = new PlanningService();
        sandbox.stub(Goal, 'getAllGoals').resolves('foo');
        const res = await planningService.getAllGoals();
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    })

    it('Test add an event', async () => {
        const planningService = new PlanningService();
        sandbox.stub(Event, 'addEvent').resolves('foo');
        const res = await planningService.addEvent(mockEvent);
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test add a goal', async () => {
        const planningService = new PlanningService();
        sandbox.stub(Goal, 'addGoal').resolves('foo');
        const res = await planningService.addGoal(mockGoal);
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    })

    it('Test delete an event', async () => {
        const planningService = new PlanningService();
        sandbox.stub(Event, 'deleteEvent').resolves('foo');
        const res = await planningService.deleteEvent(mockEvent.id);
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test delete a goal', async () => {
        const planningService = new PlanningService();
        sandbox.stub(Goal, 'deleteGoal').resolves('foo');
        const res = await planningService.deleteGoal(mockGoal.id);
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test modify goal', async () => {
        const planningService = new PlanningService();
        sandbox.stub(Goal, 'updateById').resolves('foo');
        const res = await planningService.updateGoal(
            mockGoal.id,
            mockGoal.completed, 
            mockGoal.targetDate, 
            mockGoal.title
        );
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    })
});

