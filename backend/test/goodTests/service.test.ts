import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import 'mocha';

import GoodService from '../../src/Good/good.service';
import { RawGood, Good, SemiFinishedGood, FinishedGood } from '../../src/Good/good.models';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;

describe('Good Service Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test get all goods', async () => {
        const goodService = new GoodService();
        sandbox.stub(goodService, 'cleanUpMultipleOfGoods').returns(['foo']);
        sandbox.stub(Good, 'getAllGoods').resolves('foo');
        const res = await goodService.getAllGoods();
        expect(res.message[0]).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test get all goods fails', async () => {
        const goodService = new GoodService();
        sandbox.stub(goodService, 'cleanUpMultipleOfGoods').returns(['foo']);
        sandbox.stub(Good, 'getAllGoods').throws(new Error());
        const res = await goodService.getAllGoods();
        expect(res.status).to.equal(false);
    });

    it('Test get single goods', async () => {
        const goodService = new GoodService();
        sandbox.stub(goodService, 'cleanUpGood').returns(['foo']);
        sandbox.stub(Good, 'findById').resolves('foo');
        const res = await goodService.getSingleGood(123);
        expect(res.message[0]).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test get single goods fails', async () => {
        const goodService = new GoodService();
        sandbox.stub(goodService, 'cleanUpGood').returns(['foo']);
        sandbox.stub(Good, 'findById').throws(new Error());
        const res = await goodService.getSingleGood(123);
        expect(res.status).to.equal(false);
    });

    it('Test get all goods of type', async () => {
        const goodService = new GoodService();
        sandbox.stub(goodService, 'cleanUpMultipleOfGoods').returns(['foo']);
        sandbox.stub(Good, 'getByType').resolves('foo');
        const res = await goodService.getAllGoodsOfType('bob');
        expect(res.message[0]).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test get all goods of type fails', async () => {
        const goodService = new GoodService();
        sandbox.stub(goodService, 'cleanUpMultipleOfGoods').returns(['foo']);
        sandbox.stub(Good, 'getByType').throws(new Error());
        const res = await goodService.getAllGoodsOfType('bob');
        expect(res.status).to.equal(false);
    });

    it('Test get all archive goods of type', async () => {
        const goodService = new GoodService();
        sandbox.stub(goodService, 'cleanUpMultipleOfGoods').returns(['foo']);
        sandbox.stub(Good, 'getByType').resolves('foo');
        const res = await goodService.getAllArchivedGoodsOfType('bob');
        expect(res.message[0]).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test get all archive goods of type fails', async () => {
        const goodService = new GoodService();
        sandbox.stub(goodService, 'cleanUpMultipleOfGoods').returns(['foo']);
        sandbox.stub(Good, 'getByType').throws(new Error());
        const res = await goodService.getAllArchivedGoodsOfType('bob');
        expect(res.status).to.equal(false);
    });

    it('Test clean up good raw good', () => {
        const mockgood = {
            type: 'raw',
            cost: 10,
            price: 10,
            vendor: 'bob'
        };
        const goodService = new GoodService();
        const res = goodService.cleanUpGood(mockgood);
        expect(res.price).to.equal(undefined);
    });

    it('Test clean up good semi-finished good', () => {
        const mockgood = {
            type: 'semi-finished',
            cost: 10,
            price: 10,
            vendor: 'bob'
        };
        const goodService = new GoodService();
        const res = goodService.cleanUpGood(mockgood);
        expect(res.price).to.equal(undefined);
        expect(res.vendor).to.equal(undefined);
    });

    it('Test clean up good finished good', () => {
        const mockgood = {
            type: 'finished',
            cost: 10,
            price: 10,
            vendor: 'bob'
        };
        const goodService = new GoodService();
        const res = goodService.cleanUpGood(mockgood);
        expect(res.vendor).to.equal(undefined);
    });

    it('Test clean up multiple goods', () => {
        const mockgood = [
            {
                type: 'finished',
                cost: 10,
                price: 10,
                vendor: 'bob'
            }
        ];
        const goodService = new GoodService();
        const res = goodService.cleanUpMultipleOfGoods(mockgood);
        expect(res[0].vendor).to.equal(undefined);
    });

    it('Test archive a good', async () => {
        const goodService = new GoodService();
        sandbox.stub(Good, 'archive').resolves(1);
        const res = await goodService.archiveGood(123, true);
        expect(res.status).to.equal(true);
    });

    it('Test archive a good not found', async () => {
        const goodService = new GoodService();
        sandbox.stub(Good, 'archive').resolves(0);
        const res = await goodService.archiveGood(123, true);
        expect(res.status).to.equal(false);
    });

    it('Test archive a good fails', async () => {
        const goodService = new GoodService();
        sandbox.stub(Good, 'archive').throws(new Error());
        const res = await goodService.archiveGood(123, true);
        expect(res.status).to.equal(false);
    });

    it('Test archive multiple good', async () => {
        const mock = [
            {
                id: 123,
                archive: true
            }
        ];
        const goodService = new GoodService();
        sandbox.stub(Good, 'archive').resolves(1);
        const res = await goodService.archiveMultipleGoods(mock);
        expect(res[0].status).to.equal(true);
    });

    it('Test add single good raw', async () => {
        const mock = {
            type: 'raw',
            components: []
        };
        const goodService = new GoodService();
        sandbox.stub(goodService, 'validateGoodFormat').returns(true);
        sandbox.stub(goodService, 'checkIfComponentExists').resolves([]);
        sandbox.stub(RawGood.prototype, 'save').resolves(1);
        const res = await goodService.addSingleGood(mock);
        expect(res.status).to.equal(true);
    });

    it('Test add single good semi-finished', async () => {
        const mock = {
            type: 'semi-finished',
            components: []
        };
        const goodService = new GoodService();
        sandbox.stub(goodService, 'validateGoodFormat').returns(true);
        sandbox.stub(goodService, 'checkIfComponentExists').resolves([]);
        sandbox.stub(SemiFinishedGood.prototype, 'save').resolves(1);
        const res = await goodService.addSingleGood(mock);
        expect(res.status).to.equal(true);
    });

    it('Test add single good finished', async () => {
        const mock = {
            type: 'finished',
            components: []
        };
        const goodService = new GoodService();
        sandbox.stub(goodService, 'validateGoodFormat').returns(true);
        sandbox.stub(goodService, 'checkIfComponentExists').resolves([]);
        sandbox.stub(FinishedGood.prototype, 'save').resolves(1);
        const res = await goodService.addSingleGood(mock);
        expect(res.status).to.equal(true);
    });

    it('Test add single good component not exist', async () => {
        const mock = {
            type: 'finished',
            components: [123]
        };
        const goodService = new GoodService();
        sandbox.stub(goodService, 'validateGoodFormat').returns(true);
        sandbox.stub(goodService, 'checkIfComponentExists').resolves([123]);
        sandbox.stub(FinishedGood.prototype, 'save').resolves(1);
        const res = await goodService.addSingleGood(mock);
        expect(res.status).to.equal(false);
    });

    it('Test add single good component not valid', async () => {
        const mock = {
            type: 'finished',
            components: [123]
        };
        const goodService = new GoodService();
        sandbox.stub(goodService, 'validateGoodFormat').returns(false);
        sandbox.stub(goodService, 'checkIfComponentExists').resolves([123]);
        sandbox.stub(FinishedGood.prototype, 'save').resolves(1);
        const res = await goodService.addSingleGood(mock);
        expect(res.status).to.equal(false);
    });

    it('Test add single good component fails', async () => {
        const mock = {
            type: 'finished',
            components: [123]
        };
        const goodService = new GoodService();
        sandbox.stub(goodService, 'validateGoodFormat').returns(true);
        sandbox.stub(goodService, 'checkIfComponentExists').resolves([]);
        sandbox.stub(FinishedGood.prototype, 'save').throws(new Error());
        const res = await goodService.addSingleGood(mock);
        expect(res.status).to.equal(false);
    });

    it('Test add multiple good component', async () => {
        const mock = [
            {
                type: 'finished',
                components: [123]
            }
        ];
        const goodService = new GoodService();
        sandbox.stub(goodService, 'validateGoodFormat').returns(true);
        sandbox.stub(goodService, 'checkIfComponentExists').resolves([]);
        sandbox.stub(FinishedGood.prototype, 'save').resolves(1);
        const res = await goodService.addBulkGoods(mock);
        expect(res[0].status).to.equal(true);
    });

    it('Test validate good invalid name', () => {
        const mockgood = {
            name: 123,
            type: 'finished',
            processTime: 10,
            cost: 10,
            price: 10,
            vendor: 'bob'
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(false);
    });

    it('Test validate good invalid type', () => {
        const mockgood = {
            name: '123',
            type: 'bob',
            processTime: 10,
            cost: 10,
            price: 10,
            vendor: 'bob'
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(false);
    });

    it('Test validate good invalid type not in list', () => {
        const mockgood = {
            name: '123',
            type: '123',
            processTime: 10,
            cost: 10,
            price: 10,
            vendor: 'bob'
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(false);
    });

    it('Test validate good invalid processTime', () => {
        const mockgood = {
            name: '123',
            type: 'raw',
            processTime: undefined,
            cost: 10,
            price: 10,
            vendor: 'bob'
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(false);
    });

    it('Test validate good invalid processTime negative', () => {
        const mockgood = {
            name: '123',
            type: 'raw',
            processTime: -10,
            cost: 10,
            price: 10,
            vendor: 'bob'
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(false);
    });

    it('Test validate good invalid cost negative', () => {
        const mockgood = {
            name: '123',
            type: 'raw',
            processTime: 10,
            cost: -10,
            price: 10,
            vendor: 'bob'
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(false);
    });

    it('Test validate good invalid cost', () => {
        const mockgood = {
            name: '123',
            type: 'raw',
            processTime: 10,
            cost: undefined,
            price: 10,
            vendor: 'bob'
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(false);
    });

    it('Test validate good invalid raw', () => {
        const mockgood = {
            name: '123',
            type: 'raw',
            processTime: 10,
            cost: 10,
            price: 10,
            vendor: undefined
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(false);
    });

    it('Test validate good invalid finished', () => {
        const mockgood = {
            name: '123',
            type: 'finished',
            processTime: 10,
            cost: 10,
            price: undefined,
            vendor: 'bob'
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(false);
    });

    it('Test validate good invalid finished negative price', () => {
        const mockgood = {
            name: '123',
            type: 'finished',
            processTime: 10,
            cost: 10,
            price: -10,
            vendor: 'bob'
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(false);
    });

    it('Test validate good invalid property', () => {
        const mockgood = {
            name: '123',
            type: 'finished',
            processTime: 10,
            cost: 10,
            price: 10,
            vendor: 'bob',
            properties: [
                {
                    value: undefined,
                    name: undefined
                }
            ]
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(false);
    });

    it('Test validate good invalid component', () => {
        const mockgood = {
            name: '123',
            type: 'finished',
            processTime: 10,
            cost: 10,
            price: 10,
            vendor: 'bob',
            properties: [
                {
                    value: 'bob',
                    name: 'bob'
                }
            ],
            components: [
                {
                    id: undefined,
                    quantity: undefined
                }
            ]
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(false);
    });

    it('Test validate good valid semi-finished', () => {
        const mockgood = {
            name: '123',
            type: 'semi-finished',
            processTime: 10,
            cost: 10,
            price: 10,
            vendor: 'bob',
            properties: [
                {
                    value: 'bob',
                    name: 'bob'
                }
            ],
            components: [
                {
                    id: 1,
                    quantity: 1
                }
            ]
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(true);
    });

    it('Test validate good valid finished', () => {
        const mockgood = {
            name: '123',
            type: 'finished',
            processTime: 10,
            cost: 10,
            price: 10,
            vendor: 'bob',
            properties: [
                {
                    value: 'bob',
                    name: 'bob'
                }
            ],
            components: [
                {
                    id: 1,
                    quantity: 1
                }
            ]
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(true);
    });

    it('Test validate good valid raw', () => {
        const mockgood = {
            name: '123',
            type: 'raw',
            processTime: 10,
            cost: 10,
            price: 10,
            vendor: 'bob',
            properties: [
                {
                    value: 'bob',
                    name: 'bob'
                }
            ],
            components: [
                {
                    id: 1,
                    quantity: 1
                }
            ]
        };
        const goodService = new GoodService();
        const res = goodService.validateGoodFormat(mockgood);
        expect(res).to.equal(true);
    });

    it('Test check if component exist', async () => {
        const mock = [
            {
                id: 123,
                quantity: 12
            }
        ];
        const goodService = new GoodService();
        sandbox.stub(goodService, 'getSingleGood').resolves({ status: false, message: 'bob' });
        const res = await goodService.checkIfComponentExists(mock);
        expect(res[0]).to.equal(123);
    });
});
