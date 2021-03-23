import { get_connection as db } from '../shared/dbConnection';
import { config } from '../../config';
import { OrderedGood, CompleteCustomerOrder } from './order.interfaces';
import Customer from '../Customer/customer.models';

const status = config.order.status;

class CustomerOrder {
    public status: string;
    public totalPrice: number;
    public orderedGoods: OrderedGood[];
    public customerId: number;

    constructor(customerOrder: {
        totalPrice: number;
        orderedGoods: OrderedGood[];
        customerId: number;
    }) {
        this.totalPrice = customerOrder.totalPrice;
        this.orderedGoods = customerOrder.orderedGoods;
        this.customerId = customerOrder.customerId;
        this.status = status.confirm;
    }

    /**
     * Get all the customer orders
     */
    public static async getAll(): Promise<CompleteCustomerOrder[]> {
        const orders = await db().select('*').from('customer_order');
        return await this.getOrdersWithOrderedGoods(orders);
    }

    /**
     * Get customer orders with goods
     * @param orders The orders
     */
    public static async getOrdersWithOrderedGoods(
        orders: CompleteCustomerOrder[]
    ): Promise<CompleteCustomerOrder[]> {
        const ordersWithGoods = await Promise.all(
            orders.map(async order => ({
                ...order,
                customer: await Customer.findById(order.customerId),
                orderedGoods: await this.getOrderedGoodOfOrder(order.orderId)
            }))
        );
        return ordersWithGoods;
    }

    /**
     * Get all the ordered goods of a customer order
     * @param id the id of the order
     */
    public static async getOrderedGoodOfOrder(id: number): Promise<OrderedGood[]> {
        const orderedGoods = await db()
            .select('compositeId', 'totalPrice', 'quantity')
            .from('customer_ordered_good')
            .where('orderId', '=', id);
        return orderedGoods;
    }

    /**
     * Get a customer order by id
     * @param id the id of the order
     */
    public static async getById(id: number): Promise<CompleteCustomerOrder | null> {
        const order = await db()
            .select('*')
            .from('customer_order')
            .where('orderId', '=', id)
            .first();
        if (!order) {
            return null;
        }
        return await {
            ...order,
            customer: await Customer.findById(order.customerId),
            orderedGoods: await this.getOrderedGoodOfOrder(order.orderId)
        };
    }

    /**
     * Get all the customer orders
     * @param id the customer id
     */
    public static async getByCustomerId(id: number): Promise<CompleteCustomerOrder[]> {
        const orders = await db().select('*').from('customer_order').where('customerId', '=', id);
        return await this.getOrdersWithOrderedGoods(orders);
    }

    /**
     * Get all the customer orders by order status
     * @param status the order status
     */
    public static async getByStatus(status: string): Promise<CompleteCustomerOrder[]> {
        const orders = await db().select('*').from('customer_order').where('status', '=', status);
        return await this.getOrdersWithOrderedGoods(orders);
    }

    /**
     * Save order to the database
     */
    public async save(): Promise<number> {
        const newOrder = await db()('customer_order').insert({
            totalPrice: this.totalPrice,
            status: this.status,
            customerId: this.customerId
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
        await db()('customer_ordered_good').insert(uniqueGoods);
    }

    /**
     * Update order status
     * @param id the id of the order
     * @param fields the new fields
     */
    public static async updateOrder(id: number, fields: any) {
        return await db()('customer_order').update(fields).where('orderId', '=', id);
    }
}

export { CustomerOrder };
