import { ManufacturingOrder as OrderModel } from './manufacturing.models';
import { OrderedGood, ReturnMessage } from './manufacturing.interfaces';
import { addMinute } from '../shared/Helpers';
import logger from '../shared/Logger';
import GoodService from '../Good/good.service';
import { config } from '../../config';

const status = config.manufacturing.status;

class Service {
    public goodService: GoodService;

    constructor(goodService?: GoodService) {
        this.goodService = goodService || new GoodService();
    }

    /**
     * Get all manufacturing orders from database
     */
    public async getAllOrders(): Promise<ReturnMessage> {
        try {
            const orders = await OrderModel.getAll();
            return { status: true, message: orders };
        } catch (e) {
            logger.error('Failed to get all orders', ['manufacturing', 'order', 'all'], e.message);
            return { status: false, message: 'Failed to get all orders' };
        }
    }

    /**
     * Get manufacturing orders with status from database
     * @param status The status of the orders
     */
    public async getOrdersWithStatus(status: string): Promise<ReturnMessage> {
        try {
            const orders = await OrderModel.getOrdersWithStatus(status);
            return { status: true, message: orders };
        } catch (e) {
            logger.error(
                `Failed to get orders with status: ${status}`,
                ['manufacturing', 'order', 'status'],
                e.message
            );
            return { status: false, message: `Failed to get orders with status: ${status}` };
        }
    }

    /**
     * Get manufacturing order with id from database
     * @param id the id of the order
     */
    public async getOrderFromId(id: number): Promise<ReturnMessage> {
        try {
            const order = await OrderModel.getOrderFromId(id);
            return order
                ? { status: true, message: order }
                : { status: false, message: `Order with id: ${id}, not found` };
        } catch (e) {
            logger.error(
                `Failed to get order with id: ${id}`,
                ['manufacturing', 'order', 'id'],
                e.message
            );
            return { status: false, message: `Failed to get order with id: ${id}` };
        }
    }

    /**
     * Creates a new order
     * @param order the order to be created
     */
    public async createNewOrder(orderedGoods: OrderedGood[]): Promise<ReturnMessage> {
        if (!this.validateOrderedGoods(orderedGoods))
            return { status: false, message: 'Failed to validate ordered goods' };

        const allocationRes = await this.goodService.allocateMaterialsForGoods(orderedGoods.map((o) => ({id: o.compositeId, quantity: o.quantity})));
        if(!allocationRes.status) {
            return typeof(allocationRes.message) === 'string' ? allocationRes :
                {
                    status: false,
                    message: 'Missing following components',
                    missing: allocationRes.message.map((m: {id: number, quantity: number}) => ({compositeId: m.id, quantity: m.quantity}))
                }
        }

        try {
            const res = await this.getTotalCostAndEstimatedEndTimeOfOrder(orderedGoods);
            await new OrderModel(res).save();
            logger.info(
                'New order successfully created',
                ['manufacturing', 'order', 'create'],
                orderedGoods
            );
            return { status: true, message: `New order successfully created`, order: orderedGoods };
        } catch (e) {
            logger.error(
                `Failed to create new order`,
                ['manufacturing', 'order', 'create'],
                e.message
            );
            return { status: false, message: `Failed to create new order`, order: orderedGoods };
        }
    }

    /**
     * Validate ordered goods
     * @param orderedGoods the goods to order
     */
    public validateOrderedGoods(orderedGoods: OrderedGood[]): boolean {
        let valid = true;
        orderedGoods.forEach(o => {
            if (!this.validateSingleOrderedGood(o)) valid = false;
        });
        return valid;
    }

    /**
     * Validate single ordered good
     * @param orderedGood the good to validate
     */
    public validateSingleOrderedGood(orderedGood: any): boolean {
        return (
            typeof orderedGood.quantity === 'number' &&
            orderedGood.quantity >= 0 &&
            typeof orderedGood.compositeId === 'number' &&
            orderedGood.compositeId >= 0
        );
    }

    /**
     * Calculate total cost and estimated end time
     * @param orderGood the goods to order
     */
    public async getTotalCostAndEstimatedEndTimeOfOrder(
        orderedGoods: OrderedGood[]
    ): Promise<{ totalCost: number; estimatedEndDate: Date; orderedGoods: OrderedGood[] }> {
        
        let orderedGoodWithCost: OrderedGood[];
        orderedGoodWithCost = [];

        let processTimes: number[];
        processTimes = [];

        let estimatedEndDate = new Date();
        let totalcost = 0;

        await Promise.all(
            orderedGoods.map(async o => {
                const composite = (await this.goodService.getSingleGood(o.compositeId)).message;
                const cost = o.quantity * composite.cost;
                orderedGoodWithCost.push({
                    quantity: o.quantity,
                    compositeId: o.compositeId,
                    totalCost: cost
                });
                totalcost += cost;
                processTimes.push(composite.processTime * o.quantity);
            })
        );

        let longestTime = Math.max(...processTimes);
        if (longestTime > 0) estimatedEndDate = addMinute(estimatedEndDate, longestTime);

        return {
            totalCost: totalcost,
            estimatedEndDate: estimatedEndDate,
            orderedGoods: orderedGoodWithCost
        };
    }

    /**
     * Mark multiple orders as completed
     * @param ids the ids of the orders
     */
    public async markOrdersAsComplete(ids: number[]): Promise<ReturnMessage[]> {
        return await Promise.all(
            ids.map(async id => {
                return await this.markSingleOrderAsComplete(id);
            })
        );
    }

    /**
     * Mark an order as completed
     * @param id the id of an order
     */
    public async markSingleOrderAsComplete(id: number): Promise<ReturnMessage> {
        const res = await this.getOrderFromId(id);

        if (!res.status) return { status: false, message: `Failed to get order from id: ${id}` };

        const order = res.message;
        if (order.status === status.complete)
            return { status: false, message: `Order ${id} is already ${status.complete}` };

        const listOfGoods = order.orderedGoods.map((g: OrderedGood) => ({id: g.compositeId, quantity: g.quantity}));
        const successIncrement = await this.goodService.incrementQuantitiesOfGoods(listOfGoods);
        
        if (!successIncrement)
            return {
                status: false,
                message: `Failed while updating good quantity for order ${id}`
            };

        try {
            await OrderModel.updateOrderStatus(id, status.complete);
            logger.info(`Successfully updated the status of order ${id} to ${status.complete}`);
            return {
                status: true,
                message: `Successfully updated the status of order ${id} to ${status.complete}`
            };
        } catch (e) {
            logger.error(
                `Failed while updating order status for order: ${id}`,
                ['manufacturing', status.complete, 'status'],
                e.message
            );
            return {
                status: false,
                message: `Failed while updating order status for order: ${id}`
            };
        }
    }

    /**
     * Get orders that should be completed
     */
    public async autoCompleteOrders(): Promise<ReturnMessage[]> {
        try {
            const orders = await OrderModel.getOrdersThatShouldBeCompleted();
            const ids = orders.map(o => o.orderId);
            return this.markOrdersAsComplete(ids);
        } catch (e) {
            logger.error('Failed while attempting to fetch all goods that should be done');
            return [];
        }
    }
}

export default Service;
