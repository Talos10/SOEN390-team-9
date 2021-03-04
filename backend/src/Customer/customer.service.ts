import CustomerModel from './customer.models';
import logger from '../shared/Logger';

class Service {
    public async getAllCustomers(): Promise<CustomerModel[]> {
        const allCustomers = await CustomerModel.getAll();
        return allCustomers;
    }

    public async createNewCustomer(name: string, email: string): Promise<number> {
        const newCustomer = new CustomerModel({
            name: name,
            email: email
        });
        const res = await CustomerModel.addCustomer(newCustomer);
        return res;
    }

    public async findCustomerById(customerID: number): Promise<CustomerModel> {
        const customer = await CustomerModel.findById(customerID);
        return customer;
    }

    public async updateCustomer(customerID: number, name: string, email: string): Promise<number> {
        const newCustomer = new CustomerModel({
            name: name,
            email: email
        });
        const res = await CustomerModel.updateById(customerID, newCustomer);
        return res;
    }

    /**
     * Archive or un-archive a customer
     * @param customerID the id of the customer
     * @param archive a boolean if we want to archive or not
     */
    public async archiveCustomer(customerID: number, archive: boolean): Promise<number[]> {
        try {
            if (await CustomerModel.archive(customerID, archive)) {
                logger.info(
                    `${
                        archive ? 'archive' : 'un-archive'
                    } successful for customer with id: ${customerID}`,
                    ['customer', 'archive']
                );
                return [customerID];
            }
            return [customerID];
        } catch (e) {
            logger.error(
                `Failed to ${archive ? 'archive' : 'un-archive'} customer with id: ${customerID}`,
                ['customer', 'archive'],
                e.message
            );
            return [customerID];
        }
    }

    /**
     * Get all customers that are either archived or non-archived
     * @param archive if we want the archived customers or the non-archived
     */
    public async getAllArchivedCustomers(archive: boolean): Promise<CustomerModel[]> {
        return await CustomerModel.getAllArchived(archive);
    }
}

export default Service;
