import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import 'mocha';

import PlanningService from '../../src/Planning/planning.service';
import {Event} from '../../src/Planning/planning.models';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;

const mockEvent = {
    id: 6,
    date: new Date('2021-04-10'),
    time: new Date('9:00:00'),
    title: 'test event'
};

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

    it('Test add an event', async () => {
        const planningService = new PlanningService();
        sandbox.stub(Event, 'addEvent').resolves('foo');
        const res = await planningService.addEvent(mockEvent);
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test delete an event', async () => {
        const planningService = new PlanningService();
        sandbox.stub(Event, 'deleteEvent').resolves('foo');
        const res = await planningService.deleteEvent(mockEvent.id);
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });
});