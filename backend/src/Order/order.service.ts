import logger from '../shared/Logger';
import GoodService from '../Good/good.service';
import { config } from '../../config';
import { OrderedGood, ReturnMessage } from './order.interfaces';
import { CustomerOrder } from './order.models';
import { SchemaAndGoods } from 'src/Good/good.interfaces';

const status = config.order.status;

class Service {
    public goodService: GoodService;

    constructor(goodService?: GoodService) {
        this.goodService = goodService || new GoodService();
    }

    /**
     * Get all customer orders from database
     */
    public async getAllOrders(): Promise<ReturnMessage> {
        try {
            const orders = await CustomerOrder.getAll();
            return { status: true, message: orders };
        } catch (e) {
            logger.error('Failed to get all orders', ['customer', 'order', 'all'], e.message);
            return { status: false, message: 'Failed to get all orders' };
        }
    }

    /**
     * Retrieves the income made from sales
     * @returns total income
     */
    public async getIncome(): Promise<ReturnMessage> {
        try {
            const orders = await CustomerOrder.getAll();
            let totalIncome: number = 0;
            orders.map(order => {
                if(order.status == "completed"){
                    totalIncome += order.totalPrice;
                }
            });
            return { status: true, message: totalIncome };
        } catch (e) {
            logger.error('Failed to get income', ['orders', 'income', 'total'], e.message);
            return { status: false, message: 'Failed to get income' };
        }
    }

    /**
     * Retrieves the monthly income
     * @returns the income per month
     */
    public async getIncomePerMonth(): Promise<ReturnMessage> {
        try {
            const orders = await CustomerOrder.getAll();
            const num_month: number = 12;
            let monthlyIncome: Array<number> = [];
            for (let index = 0; index < num_month; index++) {
                let monthSum: number = 0;
                orders.map(obj => {
                    if(obj.status == "completed"){
                        let month: number = obj.creationDate.getMonth();
                        if (month == index) {
                            monthSum += obj.totalPrice;
                        }
                    }
                });
                monthlyIncome.push(monthSum);
            }
            return { status: true, message: monthlyIncome };
        } catch (e) {
            logger.error(
                'Failed to get income for every month',
                ['orders', 'income', 'month'],
                e.message
            );
            return { status: false, message: 'Failed to get income per month' };
        }
    }

    /**
     * Get single customer order by id
     * @param id the id of the order
     */
    public async getOrderById(id: number): Promise<ReturnMessage> {
        try {
            const order = await CustomerOrder.getById(id);
            if (!order) return { status: false, message: 'order not found' };
            return { status: true, message: order };
        } catch (e) {
            logger.error('Failed to get order by id', ['customer', 'order', 'id'], e.message);
            return { status: false, message: 'Failed to get order by id' };
        }
    }

    /**
     * Get orders by customer id
     * @param id the id of the customer
     */
    public async getOrderByCustomerId(id: number): Promise<ReturnMessage> {
        try {
            const orders = await CustomerOrder.getByCustomerId(id);
            return { status: true, message: orders };
        } catch (e) {
            logger.error(
                'Failed to get order by customer id',
                ['customer', 'order', 'id'],
                e.message
            );
            return { status: false, message: 'Failed to get order by customer id' };
        }
    }

    /**
     * Get orders by customer id
     * @param status the status of the orders
     */
    public async getOrderByOrderStatus(status: string): Promise<ReturnMessage> {
        try {
            const orders = await CustomerOrder.getByStatus(status);
            return { status: true, message: orders };
        } catch (e) {
            logger.error(
                'Failed to get order by status',
                ['customer', 'order', 'status'],
                e.message
            );
            return { status: false, message: 'Failed to get order by status' };
        }
    }

    /**
     * Creates a new order
     * @param orderedGoods the goods to order
     */
    public async createNewOrder(
        customerId: number,
        orderedGoods: OrderedGood[]
    ): Promise<ReturnMessage> {
        if (!this.validateOrderedGoods(orderedGoods))
            return { status: false, message: 'Failed to validate ordered goods' };

        try {
            const res = await this.getTotalPrice(orderedGoods);
            await new CustomerOrder({
                orderedGoods: res.orderedGoods,
                totalPrice: res.totalPrice,
                customerId: customerId
            }).save();
            logger.info(
                'New order successfully created',
                ['customer', 'order', 'create'],
                orderedGoods
            );
            return { status: true, message: `New order successfully created`, order: orderedGoods };
        } catch (e) {
            logger.error(`Failed to create new order`, ['customer', 'order', 'create'], e.message);
            return { status: false, message: `Failed to create new order`, order: orderedGoods };
        }
    }

    /**
     * Calculate total price of order
     * @param orderGood the goods to order
     */
    public async getTotalPrice(
        orderedGoods: OrderedGood[]
    ): Promise<{ totalPrice: number; orderedGoods: OrderedGood[] }> {
        let orderedGoodWithPrice: OrderedGood[];
        orderedGoodWithPrice = [];

        let totalPrice = 0;

        await Promise.all(
            orderedGoods.map(async o => {
                const composite: any = ((await this.goodService.getSingleGood(o.compositeId))
                    .message as SchemaAndGoods)?.schema;
                if (!composite?.price) throw new Error('Composite has no price');
                const price = o.quantity * composite.price;
                orderedGoodWithPrice.push({
                    quantity: o.quantity,
                    compositeId: o.compositeId,
                    totalPrice: price
                });
                totalPrice += price;
            })
        );

        return {
            totalPrice: totalPrice,
            orderedGoods: orderedGoodWithPrice
        };
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
            case status.complete:
                return {
                    status: currentStatus === status.confirm,
                    message: `Can only complete orders that have been ${status.confirm}`
                };
            default:
                return { status: false, message: `The new status isn't valid` };
        }
    }

    /**
     * Update the status of a single order
     * @param id the id of the order
     * @param newStatus the new status
     */
    public async updateSingleOrderStatus(id: number, newStatus: string): Promise<ReturnMessage> {
        const order = await this.getOrderById(id);
        if (!order.status) return { status: false, message: `Unable to find order of id ${id}` };

        const currentStatus = order.message.status;
        const validateNewStatusRes = this.validateNewStatus(currentStatus, newStatus);
        if (!validateNewStatusRes.status) return validateNewStatusRes;

        const orderedGoods = order.message.orderedGoods;

        if (newStatus === status.complete) {
            const res = await this.allocateGoodsForOrder(orderedGoods);
            if (!res.status) return res;
        }

        const newFields = {
            status: newStatus,
            completionDate: newStatus === status.complete ? new Date() : null
        };

        try {
            await CustomerOrder.updateOrder(id, newFields);
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
     * Get the necessary component to start the order
     * @param orderedGoods the goods ordered
     */
    public async allocateGoodsForOrder(orderedGoods: OrderedGood[]): Promise<ReturnMessage> {
        const allocationRes = await this.goodService.decrementQuantitiesOfGoods(
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
}

export default Service;
