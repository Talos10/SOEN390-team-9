import {
    OrderedGood,
    ManufacturingOrderInterface,
    ManufacturingConstructor
} from './manufacturing.interfaces';
import db from '../shared/dbConnection';
import { config } from '../../config';

const status = config.manufacturing.status;

class ManufacturingOrder {
    public totalCost: number;
    public orderedGoods: OrderedGood[];

    constructor(manufacturingOrder: ManufacturingConstructor) {
        this.totalCost = manufacturingOrder.totalCost;
        this.orderedGoods = manufacturingOrder.orderedGoods;
    }

    /**
     * Get all the manufacturing orders
     */
    public static async getAll(): Promise<ManufacturingOrderInterface[]> {
        const orders = await db.select('*').from('manufacturing_order');
        return await this.getOrdersWithOrderedGoods(orders);
    }

    /**
     * Get all the manufacturing orders with status
     */
    public static async getOrdersWithStatus(
        status: string
    ): Promise<ManufacturingOrderInterface[]> {
        const orders = await db
            .select('*')
            .from('manufacturing_order')
            .where('status', '=', status);
        return await this.getOrdersWithOrderedGoods(orders);
    }

    /**
     * Get all the manufacturing orders with status
     */
    public static async getOrderFromId(id: number): Promise<ManufacturingOrderInterface> {
        const existing = await db
            .select('*')
            .from('manufacturing_order')
            .where('orderId', '=', id)
            .first();

        if (existing) {
            return {
                ...existing,
                orderedGoods: await this.getOrderedGoodOfOrder(id)
            };
        }

        return existing;
    }

    /**
     * Get manufacturing orders with goods
     * @param orders The orders
     */
    public static async getOrdersWithOrderedGoods(
        orders: ManufacturingOrderInterface[]
    ): Promise<ManufacturingOrderInterface[]> {
        const ordersWithGoods = await Promise.all(
            orders.map(async order => ({
                ...order,
                orderedGoods: await this.getOrderedGoodOfOrder(order.orderId)
            }))
        );
        return ordersWithGoods;
    }

    /**
     * Get all the ordered goods of a manufacturing order
     * @param id the id of the order
     */
    public static async getOrderedGoodOfOrder(id: number): Promise<OrderedGood[]> {
        const orderedGoods = await db
            .select('compositeId', 'totalCost', 'quantity')
            .from('ordered_good')
            .where('orderId', '=', id);
        return orderedGoods;
    }

    /**
     * Save order to the database
     */
    public async save(): Promise<number> {
        const newOrder = await db('manufacturing_order').insert({
            totalCost: this.totalCost,
            status: status.confirm
        });
        const id = newOrder[0];
        await this.saveOrderedGoods(id);
        return id;
    }

    /**
     * Save all ordered goods to the database
     * @param id the id of the order
     */
    public async saveOrderedGoods(id: number) {
        const orderedGoods = this.orderedGoods.map(o => ({
            ...o,
            orderId: id
        }));
        let unique: number[];
        unique = [];
        const uniqueGoods = orderedGoods.filter(o => {
            if (unique.includes(o.compositeId)) return false;
            unique.push(o.compositeId);
            return true;
        });
        await db('ordered_good').insert(uniqueGoods);
    }

    /**
     * Update order status
     * @param id the id of the order
     * @param status the new status
     */
    public static async updateOrder(id: number, fields: any) {
        return await db('manufacturing_order').update(fields).where('orderId', '=', id);
    }

    /**
     * Get all orders that should be completed
     */
    public static async getOrdersThatShouldBeCompleted(): Promise<ManufacturingOrderInterface[]> {
        const currentDate = new Date();
        const orders = await db
            .select('orderId')
            .from('manufacturing_order')
            .where('estimatedEndDate', '<=', currentDate)
            .where('status', '=', status.process);
        return orders;
    }
}

export { ManufacturingOrder };
