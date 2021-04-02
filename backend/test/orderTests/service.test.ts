import * as sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { expect } from 'chai';
import 'mocha';

import GoodService from '../../src/Good/good.service';
import OrderService from '../../src/Order/order.service';
import { CustomerOrder } from '../../src/Order/order.models';

sinonStubPromise(sinon);

let sandbox: sinon.SinonSandbox;

describe('Customer Order Service Test', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Test get all customer orders', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);
        sandbox.stub(CustomerOrder, 'getAll').resolves('foo');
        const res = await mockOrderService.getAllOrders();
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test get all manufacturing orders fails', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);
        sandbox.stub(CustomerOrder, 'getAll').throws(new Error());
        const res = await mockOrderService.getAllOrders();
        expect(res.message).to.equal('Failed to get all orders');
        expect(res.status).to.equal(false);
    });

    it('Test get total income', async () => {
        const mockOrder = [
            {
                totalPrice: 6.0,
                status: 'completed'
            },
            {
                totalPrice: 4.0,
                status: 'completed'
            }
        ];
        const orderService = new OrderService();
        sandbox.stub(CustomerOrder, 'getAll').resolves(mockOrder);
        const res = await orderService.getIncome();
        expect(res.message).to.equal(10);
        expect(res.status).to.equal(true);
    });

    it('Test get total income per month', async () => {
        const mockOrder = [
            {
                totalPrice: 6.0,
                creationDate: new Date('2021-01-02'),
                status: 'completed'
            },
            {
                totalPrice: 4.0,
                creationDate: new Date('2021-01-02'),
                status: 'completed'
            }
        ];
        const orderService = new OrderService();
        sandbox.stub(CustomerOrder, 'getAll').resolves(mockOrder);
        const res = await orderService.getIncomePerMonth();
        expect(res.message).to.eql([10.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        expect(res.status).to.equal(true);
    });

    it('Test get customer orders by id', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);
        sandbox.stub(CustomerOrder, 'getById').resolves('foo');
        const res = await mockOrderService.getOrderById(1);
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test get customer orders by id fails', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);
        sandbox.stub(CustomerOrder, 'getById').throws(new Error());
        const res = await mockOrderService.getOrderById(1);
        expect(res.message).to.equal('Failed to get order by id');
        expect(res.status).to.equal(false);
    });

    it('Test get customer orders by customer id', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);
        sandbox.stub(CustomerOrder, 'getByCustomerId').resolves('foo');
        const res = await mockOrderService.getOrderByCustomerId(1);
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test get customer orders by customer id fails', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);
        sandbox.stub(CustomerOrder, 'getByCustomerId').throws(new Error());
        const res = await mockOrderService.getOrderByCustomerId(1);
        expect(res.message).to.equal('Failed to get order by customer id');
        expect(res.status).to.equal(false);
    });

    it('Test get customer orders by status', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);
        sandbox.stub(CustomerOrder, 'getByStatus').resolves('foo');
        const res = await mockOrderService.getOrderByOrderStatus('temp');
        expect(res.message).to.equal('foo');
        expect(res.status).to.equal(true);
    });

    it('Test get customer orders by status fails', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);
        sandbox.stub(CustomerOrder, 'getByStatus').throws(new Error());
        const res = await mockOrderService.getOrderByOrderStatus('temp');
        expect(res.message).to.equal('Failed to get order by status');
        expect(res.status).to.equal(false);
    });

    it('Test create new order invalid ordered goods', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);

        sandbox.stub(mockOrderService, 'validateOrderedGoods').returns(false);

        const res = await mockOrderService.createNewOrder(1, []);
        expect(res.message).to.equal('Failed to validate ordered goods');
        expect(res.status).to.equal(false);
    });

    it('Test create new order success', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);

        sandbox.stub(CustomerOrder.prototype, 'save').resolves(true);
        sandbox.stub(mockOrderService, 'validateOrderedGoods').returns(true);
        sandbox
            .stub(mockOrderService, 'getTotalPrice')
            .resolves({ totalPrice: 50, orderedGoods: [] });

        const res = await mockOrderService.createNewOrder(1, []);
        expect(res.message).to.equal('New order successfully created');
        expect(res.status).to.equal(true);
    });

    it('Test create new order fails', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);

        sandbox.stub(CustomerOrder.prototype, 'save').throws(new Error());
        sandbox.stub(mockOrderService, 'validateOrderedGoods').returns(true);
        sandbox
            .stub(mockOrderService, 'getTotalPrice')
            .resolves({ totalPrice: 50, orderedGoods: [] });

        const res = await mockOrderService.createNewOrder(1, []);
        expect(res.message).to.equal('Failed to create new order');
        expect(res.status).to.equal(false);
    });

    it('Test get total price', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);

        sandbox.stub(mockOrderService, 'validateOrderedGoods').returns(true);
        mockGoodService.getSingleGood.resolves({ message: { schema: { price: 10 } } });

        const res = await mockOrderService.getTotalPrice([{ compositeId: 1, quantity: 2 }]);
        expect(res.totalPrice).to.equal(20);
    });

    it('Test get total price fails', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);

        sandbox.stub(mockOrderService, 'validateOrderedGoods').returns(true);
        mockGoodService.getSingleGood.resolves({ message: {} });

        try {
            expect(
                await mockOrderService.getTotalPrice([{ compositeId: 1, quantity: 2 }])
            ).to.throw('Composite has no price');
        } catch (e) {
            expect(e.name).to.equal('Error');
        }
    });

    it('Test validate ordered goods', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);

        const res = await mockOrderService.validateOrderedGoods([{ compositeId: 1, quantity: 2 }]);
        expect(res).to.equal(true);
    });

    it('Test validate ordered goods invalid negative quantity', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);

        const res = await mockOrderService.validateOrderedGoods([{ compositeId: 1, quantity: -1 }]);
        expect(res).to.equal(false);
    });

    it('Test validate ordered goods invalid negative composite', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);

        const res = await mockOrderService.validateOrderedGoods([{ compositeId: -1, quantity: 1 }]);
        expect(res).to.equal(false);
    });

    it('Test validate new status fails 1', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);

        const res = await mockOrderService.validateNewStatus('confirmed', 'confirmed');
        expect(res.status).to.equal(false);
    });

    it('Test validate new status fails 2', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);

        const res = await mockOrderService.validateNewStatus('cancelled', 'cancelled');
        expect(res.status).to.equal(false);
    });

    it('Test validate new status fails 3', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);

        const res = await mockOrderService.validateNewStatus('completed', 'completed');
        expect(res.status).to.equal(false);
    });

    it('Test validate new status fails 4', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);

        const res = await mockOrderService.validateNewStatus('completed', 'foo');
        expect(res.status).to.equal(false);
    });

    it('Test validate new status success', async () => {
        const mockGoodService = sandbox.createStubInstance(GoodService);
        const mockOrderService = new OrderService(mockGoodService);

        const res = await mockOrderService.validateNewStatus('confirmed', 'cancelled');
        expect(res.status).to.equal(true);
    });
});
