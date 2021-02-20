import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import 'mocha';

import GoodService from '../../src/Good/good.service';
import ManufacturingService from '../../src/Manufacturing/manufacturing.service';
import { ManufacturingOrder } from '../../src/Manufacturing/manufacturing.models';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;

describe('Manufacturing Service Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test get all manufacturing orders', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(ManufacturingOrder, 'getAll').resolves('foo');
        const res = await manufacturingService.getAllOrders();
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test get all manufacturing orders fails', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(ManufacturingOrder, 'getAll').throws(new Error);
        const res = await manufacturingService.getAllOrders();
        expect(res.message).to.equal('Failed to get all orders');
        expect(res.status).to.equal(false);
    });

    it('Test get all manufacturing orders from status', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(ManufacturingOrder, 'getOrdersWithStatus').resolves('foo');
        const res = await manufacturingService.getOrdersWithStatus('123');
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test get all manufacturing orders fails from status', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(ManufacturingOrder, 'getOrdersWithStatus').throws(new Error);
        const res = await manufacturingService.getOrdersWithStatus('123');
        expect(res.message).to.equal('Failed to get orders with status: 123');
        expect(res.status).to.equal(false);
    });

    it('Test get manufacturing order from id', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(ManufacturingOrder, 'getOrderFromId').resolves('foo');
        const res = await manufacturingService.getOrderFromId(1);
        expect(res.status).to.equal(true);
    });

    it('Test get manufacturing order from id not found', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(ManufacturingOrder, 'getOrderFromId').resolves(undefined);
        const res = await manufacturingService.getOrderFromId(1);
        expect(res.status).to.equal(false);
    });

    it('Test get manufacturing order fails from id', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(ManufacturingOrder, 'getOrderFromId').throws(new Error);
        const res = await manufacturingService.getOrderFromId(1);
        expect(res.status).to.equal(false);
    });

    it('Test create new manufacturing order fail to validate', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        
        sandbox.stub(manufacturingService, 'validateOrderedGoods').returns(false);
        
        const res = await manufacturingService.createNewOrder([]);
        
        expect(res.status).to.equal(false);
    });

    it('Test create new manufacturing order fail to allocate', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        
        sandbox.stub(manufacturingService, 'validateOrderedGoods').returns(true);
        mockGoodService.allocateMaterialsForGoods.resolves({status: false, message: 'hello'});
        
        const res = await manufacturingService.createNewOrder([]);
        
        expect(res.status).to.equal(false);
    });

    it('Test create new manufacturing order missing components', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        
        sandbox.stub(manufacturingService, 'validateOrderedGoods').returns(true);
        mockGoodService.allocateMaterialsForGoods.resolves({status: false, message: [{id: 123, quantity: 123}]});
        
        const res = await manufacturingService.createNewOrder([]);
        
        expect(res.status).to.equal(false);
    });

    it('Test create new manufacturing order fails', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        
        sandbox.stub(manufacturingService, 'getTotalCostAndEstimatedEndTimeOfOrder').throws(new Error);
        mockGoodService.allocateMaterialsForGoods.resolves({status: true, message: []});
        
        const res = await manufacturingService.createNewOrder([]);
        
        expect(res.status).to.equal(false);
    });

    it('Test create new manufacturing order success', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        
        sandbox.stub(manufacturingService, 'getTotalCostAndEstimatedEndTimeOfOrder').resolves(true);
        sandbox.stub(ManufacturingOrder.prototype, 'save').resolves(true);
        mockGoodService.allocateMaterialsForGoods.resolves({status: true, message: []});
        
        const res = await manufacturingService.createNewOrder([]);
        
        expect(res.status).to.equal(true);
    });

    it('Test validate ordered goods', async () => {
        const mock = {
            totalCost: 123,
            quantity: 123,
            compositeId: 123
        }
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        
        sandbox.stub(manufacturingService, 'validateSingleOrderedGood').returns(true);
        
        const res = await manufacturingService.validateOrderedGoods([mock]);
        
        expect(res).to.equal(true);
    });

    it('Test validate ordered goods fails', async () => {
        const mock = {
            totalCost: 123,
            quantity: 123,
            compositeId: 123
        }
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        
        sandbox.stub(manufacturingService, 'validateSingleOrderedGood').returns(false);
        
        const res = await manufacturingService.validateOrderedGoods([mock]);
        
        expect(res).to.equal(false);
    });

    it('Test validate single ordered good', async () => {
        const mock = {
            totalCost: 123,
            quantity: 123,
            compositeId: 123
        }
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
                
        const res = await manufacturingService.validateSingleOrderedGood(mock);
        
        expect(res).to.equal(true);
    });

    it('Test validate single ordered good missing quantity', async () => {
        const mock = {
            totalCost: 123,
            quantity: undefined,
            compositeId: 123
        }
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
                
        const res = await manufacturingService.validateSingleOrderedGood(mock);
        
        expect(res).to.equal(false);
    });

    it('Test validate single ordered good missing id', async () => {
        const mock = {
            totalCost: 123,
            quantity: 10,
            compositeId: undefined
        }
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
                
        const res = await manufacturingService.validateSingleOrderedGood(mock);
        
        expect(res).to.equal(false);
    });

    it('Test validate single ordered good invalid id', async () => {
        const mock = {
            totalCost: 123,
            quantity: 10,
            compositeId: -1
        }
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
                
        const res = await manufacturingService.validateSingleOrderedGood(mock);
        
        expect(res).to.equal(false);
    });

    it('Test validate single ordered good invalid quantity', async () => {
        const mock = {
            totalCost: 123,
            quantity: -10,
            compositeId: 1
        }
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
                
        const res = await manufacturingService.validateSingleOrderedGood(mock);
        
        expect(res).to.equal(false);
    });

    it('Test get total cost and estimated end time', async () => {
        const mock = [{
            totalCost: 123,
            quantity: 10,
            compositeId: 1
        }]
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        mockGoodService.getSingleGood.resolves({
            status: true,
            message: {
                cost: 100,
                processTime: 100
            }
        })
        const res = await manufacturingService.getTotalCostAndEstimatedEndTimeOfOrder(mock);
        
        expect(res.totalCost).to.equal(1000);
    });

    it('Test mark orders as complete', async () => {
        const mock = [1, 2, 3, 4, 5]
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(manufacturingService, 'markSingleOrderAsComplete').resolves(true);

        const res = await manufacturingService.markOrdersAsComplete(mock);
        
        expect(res[0]).to.equal(true);
    });

    it('Test mark single order as complete invalid id', async () => {
        const mock = 1
        const mockOrder = {
            status: 'completed',
        }
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(manufacturingService, 'getOrderFromId').resolves({status: false, message: mockOrder});

        const res = await manufacturingService.markSingleOrderAsComplete(mock);
        
        expect(res.status).to.equal(false);
    });


    it('Test mark single order as complete invalid status', async () => {
        const mock = 1
        const mockOrder = {
            status: 'completed',
        }
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(manufacturingService, 'getOrderFromId').resolves({status: true, message: mockOrder});

        const res = await manufacturingService.markSingleOrderAsComplete(mock);
        
        expect(res.status).to.equal(false);
    });

    it('Test mark single order as complete increment fails', async () => {
        const mock = 1
        const mockOrder = {
            status: 'processing',
            orderedGoods: [{
                compositeId: 1,
                quantity: 10
            }]
        }
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(manufacturingService, 'getOrderFromId').resolves({status: true, message: mockOrder});
        mockGoodService.incrementQuantitiesOfGoods.resolves(false);

        const res = await manufacturingService.markSingleOrderAsComplete(mock);
        
        expect(res.status).to.equal(false);
    });

    it('Test mark single order as complete success', async () => {
        const mock = 1
        const mockOrder = {
            status: 'processing',
            orderedGoods: [{
                compositeId: 1,
                quantity: 10
            }]
        }
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(manufacturingService, 'getOrderFromId').resolves({status: true, message: mockOrder});
        sandbox.stub(ManufacturingOrder, 'updateOrderStatus').resolves(true);
        mockGoodService.incrementQuantitiesOfGoods.resolves(true);

        const res = await manufacturingService.markSingleOrderAsComplete(mock);
        
        expect(res.status).to.equal(true);
    });

    it('Test mark single order as complete crashes', async () => {
        const mock = 1
        const mockOrder = {
            status: 'processing',
            orderedGoods: [{
                compositeId: 1,
                quantity: 10
            }]
        }
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(manufacturingService, 'getOrderFromId').resolves({status: true, message: mockOrder});
        sandbox.stub(ManufacturingOrder, 'updateOrderStatus').throws(new Error);
        mockGoodService.incrementQuantitiesOfGoods.resolves(true);

        const res = await manufacturingService.markSingleOrderAsComplete(mock);
        
        expect(res.status).to.equal(false);
    });

    it('Test mark order as complete automatic', async () => {
        const mockOrders = [{
            orderId: 1,
            status: 'processing',
            orderedGoods: [{
                compositeId: 1,
                quantity: 10
            }]
        }]
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(manufacturingService, 'markOrdersAsComplete').resolves(true);
        sandbox.stub(ManufacturingOrder, 'getOrdersThatShouldBeCompleted').resolves(mockOrders);

        const res = await manufacturingService.autoCompleteOrders();
        
        expect(res).to.equal(true);
    });

    it('Test mark order as complete automatic crash', async () => {
        const mockOrders = [{
            orderId: 1,
            status: 'processing',
            orderedGoods: [{
                compositeId: 1,
                quantity: 10
            }]
        }]
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const manufacturingService = new ManufacturingService(mockGoodService);
        sandbox.stub(manufacturingService, 'markOrdersAsComplete').resolves(true);
        sandbox.stub(ManufacturingOrder, 'getOrdersThatShouldBeCompleted').throws(new Error);

        const res = await manufacturingService.autoCompleteOrders();
        
        expect(res.length).to.equal(0);
    });
});