import { Router, Request, Response } from 'express';
import passport from 'passport';

import ManufacturingService from './manufacturing.service';

class Controller {
    public path = '/manufacturing';
    public router = Router();
    private manufacturingService: ManufacturingService;

    constructor(manufacturingService?: ManufacturingService) {
        this.initRoutes();
        this.manufacturingService = manufacturingService || new ManufacturingService();
    }

    private initRoutes() {
        /**
         * Get all the manufacturing orders
         */
        this.router.get(
            '/order/',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const results = await this.manufacturingService.getAllOrders();
                res.json(results);
            }
        );

        /**
         * Get all the manufacturing orders with status
         */
        this.router.get(
            '/order/status/:status',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const status = req.params.status;
                const results = await this.manufacturingService.getOrdersWithStatus(status);
                res.json(results);
            }
        );

        /**
         * Get manufacturing order from id
         */
        this.router.get(
            '/order/id/:id',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const id = req.params.id;
                const results = await this.manufacturingService.getOrderFromId(Number(id));
                res.json(results);
            }
        );

        /**
         * Get expenses
         */
        this.router.get(
            '/expense',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const results = await this.manufacturingService.getExpense();
                res.json(results);
            }
        );

        /**
         * Get expenses for each month
         */
        this.router.get(
            '/expense/month',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const results = await this.manufacturingService.getExpensesPerMonth();
                res.json(results);
            }
        );

        /**
         * Create new manufacturing order
         */
        this.router.post(
            '/order/',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const orderedGoods = req.body;
                const results = await this.manufacturingService.createNewOrder(orderedGoods);
                res.json(results);
            }
        );

        /**
         * Complete orders
         */
        this.router.put(
            '/order/:newStatus',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const orders = req.body;
                const status = req.params.newStatus;
                const results = await this.manufacturingService.updateStatusOfOrdersInBulk(
                    orders,
                    status
                );
                res.json(results);
            }
        );

        /**
         * Complete automatically depending on date
         */
        this.router.put(
            '/order/complete/auto',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const results = await this.manufacturingService.autoCompleteOrders();
                res.json(results);
            }
        );
    }
}

export default Controller;
