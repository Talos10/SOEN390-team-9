import { get_connection as db } from '../shared/dbConnection';
import { Clients } from './customer.interface';

class Customer {
    public customerId!: number;
    public name: string;
    public email: string;

    constructor(customer: { name: string; email: string }) {
        this.name = customer.name;
        this.email = customer.email;
    }

    /**
     * Returns a list of all customers
     */
    public static async getAll(): Promise<Customer[]> {
        return await db()('customer').select('customerId', 'name', 'email');
    }

    /**
     * Returns the top 3 customers sorted by the total money they spent
     */
    public static async getTop3Customers(): Promise<Clients[]> {
        return await db()
            .select('customer_order.customerId', 'customer.name', 'customer.email')
            .sum({ totalSpent: 'customer_order.totalPrice' })
            .count({ numOrders: '*' })
            .from('customer_order')
            .innerJoin('customer', 'customer_order.customerId', 'customer.customerId')
            .where('customer_order.status', '!=', 'cancelled')
            .groupBy('customer_order.customerId')
            .orderBy('totalSpent', 'desc')
            .limit(3);
    }

    /**
     * Adds a new customer
     * @param user the customer we wish to add
     */
    public static async addCustomer(user: Customer): Promise<number> {
        return await db()('customer').insert(user);
    }

    /**
     * Finds a customer based on their id
     * @param customerID the id of the customer
     */
    public static async findById(customerID: number): Promise<Customer> {
        return await db()('customer')
            .select('customerId', 'name', 'email')
            .where('customerId', customerID)
            .first();
    }

    /**
     * Updates the name and email of a customer
     * @param customerID the id of the customer
     * @param customer the updated customer
     */
    public static async updateById(customerID: number, customer: Customer): Promise<number> {
        return await db()('customer')
            .update({
                name: customer.name,
                email: customer.email
            })
            .where('customerId', customerID);
    }

    /**
     * Archive customer
     * @param customerID the customerID of the customer
     * @param archive a boolean representing if we want to archive or not
     */
    public static async archive(customerID: number, archive: boolean): Promise<number> {
        return await db()('customer')
            .update({
                archived: archive ? 1 : 0
            })
            .where('customerId', '=', customerID);
    }

    /**
     * Retrieve all customers that are either archived or non-archived
     * @param archive if we want the archived customers or the non-archived
     */
    public static async getAllArchived(archive?: boolean): Promise<Customer[]> {
        return await db()('customer')
            .select('customerId', 'name', 'email')
            .where('archived', '=', archive ? 1 : 0);
    }
}

export default Customer;
