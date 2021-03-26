import { Router, Request, Response } from 'express';
import CustomerService from './customer.service';
import passport from 'passport';
import { requireParams, isNotNUllUndefinedEmpty } from '../shared/middleware/paramsChecker';

class Controller {
    public path = '/customer';
    public router = Router();
    private customerService: CustomerService;

    constructor(customerService: any = null) {
        this.customerService = customerService || new CustomerService();
        this.initRoutes();
    }

    private initRoutes() {
        // Retrieve all customers.
        this.router.get(
            '/',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const result = await this.customerService.getAllCustomers();
                res.json(result);
            }
        );

        // Create new customer.
        this.router.post(
            '/',
            requireParams(['name', 'email']),
            isNotNUllUndefinedEmpty(['name', 'email']),
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const { name, email } = req.body;
                const result = await this.customerService.createNewCustomer(name, email);
                res.json(result);
            }
        );

        // Retrieve a single customer with customerID.
        this.router.get(
            '/:customerID',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const id = Number(req.params.customerID);
                const result = await this.customerService.findCustomerById(id);
                res.json(result);
            }
        );

        // Update a customer with customerID.
        this.router.put(
            '/:customerID',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const id = Number(req.params.customerID);
                const { name, email } = req.body;
                const result = await this.customerService.updateCustomer(id, name, email);
                res.json(result);
            }
        );

        /**
         * Archive or un-archive a customer
         */
        this.router.post(
            '/archive',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const { id, archived } = req.body;
                const results = await this.customerService.archiveCustomer(id, archived);
                res.json(results);
            }
        );

        /**
         * Get all archived or non-archived customers
         */
        this.router.get(
            '/archive/:archived',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const archivedNum = Number(req.params.archived);
                let archived;

                if (archivedNum == 0) {
                    archived = false;
                } else {
                    archived = true;
                }

                const results = await this.customerService.getAllArchivedCustomers(archived);
                res.json(results);
            }
        );
    }
}

export default Controller;
