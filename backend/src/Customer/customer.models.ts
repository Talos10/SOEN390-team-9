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

    public static async getAll(): Promise<Customer[]> {
        return await db()('customer').select('customerID', 'name', 'email');
    }

    public static async getTopCustomers(): Promise<Clients[]> {
        return await db()
            // .select('customer_order.customerId', 'customer.name')
            // .sum({totalPrice: 'customer_order.totalPrice'})
            // .from('customer_order')
            // .leftJoin('customer', 'customer_order.customerId', 'customer.customerId')
            // .groupBy('customer_order.customerId')
            // .orderBy('customer_order.totalPrice', 'desc')
            // .limit(3);
    }

    public static async addCustomer(user: Customer): Promise<number> {
        return await db()('customer').insert(user);
    }

    public static async findById(customerID: number): Promise<Customer> {
        return await db()('customer')
            .select('customerId', 'name', 'email')
            .where('customerID', customerID)
            .first();
    }

    public static async updateById(customerID: number, customer: Customer): Promise<number> {
        return await db()('customer')
            .update({
                name: customer.name,
                email: customer.email
            })
            .where('customerID', customerID);
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
            .where('customerID', '=', customerID);
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
