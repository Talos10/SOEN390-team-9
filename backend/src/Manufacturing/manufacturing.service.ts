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
     * @param orderedGoods the goods to order
     */
    public async createNewOrder(orderedGoods: OrderedGood[]): Promise<ReturnMessage> {
        if (!this.validateOrderedGoods(orderedGoods))
            return { status: false, message: 'Failed to validate ordered goods' };
        try {
            const res = await this.getTotalCostAndEstimatedEndTimeOfOrder(orderedGoods);
            await new OrderModel({
                orderedGoods: res.orderedGoods,
                totalCost: res.totalCost
            }).save();
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
     * Validate if the new status is correct
     * @param currentStatus the current status of the order
     * @param newStatus the new status that we want
     */
    public validateNewStatus(currentStatus: string, newStatus: string): ReturnMessage {
        switch (newStatus) {
            case status.confirm:
                return {
                    status: currentStatus === status.cancel,
                    message: `Can only confirm orders that have been ${status.cancel}`
                };
            case status.cancel:
                return {
                    status: currentStatus === status.confirm,
                    message: `Can only cancel orders that have been ${status.confirm}`
                };
            case status.process:
                return {
                    status: currentStatus === status.confirm,
                    message: `Can only process orders that have been ${status.confirm}`
                };
            case status.complete:
                return {
                    status: currentStatus === status.process,
                    message: `Can only complete orders that have been ${status.process}`
                };
            default:
                return { status: false, message: `The new status isn't valid` };
        }
    }

    /**
     * Get the new fields in the order once status updated
     * @param newStatus new status
     * @param orderedGoods the list of goods ordered
     */
    public async getUpdatedOrderFields(
        newStatus: string,
        orderedGoods: OrderedGood[]
    ): Promise<any> {
        const fields = { status: newStatus };
        switch (newStatus) {
            case status.process:
                const temp = await this.getTotalCostAndEstimatedEndTimeOfOrder(orderedGoods);
                return {
                    ...fields,
                    startDate: new Date(),
                    estimatedEndDate: temp.estimatedEndDate
                };
            case status.complete:
                return {
                    ...fields,
                    completionDate: new Date()
                };
        }
        return fields;
    }

    /**
     * Get the necessary component to start the order
     * @param orderedGoods the goods ordered
     */
    public async allocateComponentsForOrder(orderedGoods: OrderedGood[]): Promise<ReturnMessage> {
        const allocationRes = await this.goodService.allocateMaterialsForGoods(
            orderedGoods.map(o => ({ id: o.compositeId, quantity: o.quantity }))
        );
        if (!allocationRes.status) {
            return typeof allocationRes.message === 'string'
                ? allocationRes
                : {
                      status: allocationRes.status,
                      message: 'Missing following components',
                      missing: allocationRes.message.map((m: { id: number; quantity: number }) => ({
                          compositeId: m.id,
                          quantity: m.quantity
                      }))
                  };
        }
        return { status: true, message: 'Allocation successful' };
    }

    /**
     * Increase the quantity of goods once completed
     * @param orderedGoods the goods ordered
     */
    public async increaseQuantityOfManufacturedGoods(
        orderedGoods: OrderedGood[]
    ): Promise<ReturnMessage> {
        const listOfGoods = orderedGoods.map((g: OrderedGood) => ({
            id: g.compositeId,
            quantity: g.quantity
        }));
        const successIncrement = await this.goodService.incrementQuantitiesOfGoods(listOfGoods);

        if (!successIncrement)
            return {
                status: false,
                message: `Failed while updating good quantity for order`
            };
        return {
            status: true,
            message: `Ordered good increment quantity successfull`
        };
    }

    /**
     * Update the status of orders in bulk
     * @param ids a list of ids
     * @param newStatus the new status
     */
    public async updateStatusOfOrdersInBulk(
        ids: number[],
        newStatus: string
    ): Promise<ReturnMessage[]> {
        return Promise.all(
            ids.map(async id => {
                return await this.updateSingleOrderStatus(id, newStatus);
            })
        );
    }

    /**
     * Update the status of a single order
     * @param id the id of the order
     * @param newStatus the new status
     */
    public async updateSingleOrderStatus(id: number, newStatus: string): Promise<ReturnMessage> {
        const order = await this.getOrderFromId(id);
        if (!order.status) return { status: false, message: `Unable to find order of id ${id}` };

        const currentStatus = order.message.status;
        const validateNewStatusRes = this.validateNewStatus(currentStatus, newStatus);
        if (!validateNewStatusRes.status) return validateNewStatusRes;

        const orderedGoods = order.message.orderedGoods;

        const newField = await this.getUpdatedOrderFields(newStatus, orderedGoods);

        if (newStatus === status.process) {
            const res = await this.allocateComponentsForOrder(orderedGoods);
            if (!res.status) return res;
        }

        if (newStatus === status.complete) {
            const res = await this.increaseQuantityOfManufacturedGoods(orderedGoods);
            if (!res.status) return res;
        }

        try {
            await OrderModel.updateOrder(id, newField);
            logger.info(`Successfully updated the status of order ${id} to ${newStatus}`);
            return {
                status: true,
                message: `Successfully updated the status of order ${id} to ${newStatus}`
            };
        } catch (e) {
            logger.error(
                `Failed while updating order status for order: ${id}`,
                ['manufacturing', newStatus, 'status'],
                e.message
            );
            return {
                status: false,
                message: `Failed while updating order status for order: ${id}`
            };
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
     * Get orders that should be completed
     */
    public async autoCompleteOrders(): Promise<ReturnMessage[]> {
        try {
            const orders = await OrderModel.getOrdersThatShouldBeCompleted();
            const ids = orders.map(o => o.orderId);
            return this.updateStatusOfOrdersInBulk(ids, status.complete);
        } catch (e) {
            logger.error('Failed while attempting to fetch all goods that should be done');
            return [];
        }
    }
}

export default Service;
