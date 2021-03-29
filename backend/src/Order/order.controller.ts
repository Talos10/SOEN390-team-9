import { Router, Request, Response } from 'express';
import passport from 'passport';

import OrderService from './order.service';

class Controller {
    public path = '/order';
    public router = Router();
    private orderService: OrderService;

    constructor(orderService?: OrderService) {
        this.initRoutes();
        this.orderService = orderService || new OrderService();
    }

    private initRoutes() {
        /**
         * Get all the customer orders
         */
        this.router.get(
            '/',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const results = await this.orderService.getAllOrders();
                res.json(results);
            }
        );

        /**
         * Get single the customer order by id
         */
        this.router.get(
            '/id/:id',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const id = Number(req.params.id);
                const results = await this.orderService.getOrderById(id);
                res.json(results);
            }
        );

        /**
         * Get customer orders by customer id
         */
        this.router.get(
            '/customer/id/:id',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const id = Number(req.params.id);
                const results = await this.orderService.getOrderByCustomerId(id);
                res.json(results);
            }
        );

        /**
         * Get customer orders by customer id
         */
        this.router.get(
            '/status/:status',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const status = req.params.status;
                const results = await this.orderService.getOrderByOrderStatus(status);
                res.json(results);
            }
        );

        /**
         * Get total income
         */
        this.router.get(
            '/income',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const results = await this.orderService.getIncome();
                res.json(results);
            }
        );

        /**
         * Get income per month
         */
        this.router.get(
            '/income/month',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const results = await this.orderService.getIncomePerMonth();
                res.json(results);
            }
        );

        /**
         * Create new customer order
         */
        this.router.post(
            '/',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const data = req.body;
                const orderedGoods = data.orderedGoods;
                const customerId = data.customerId;
                const results = await this.orderService.createNewOrder(customerId, orderedGoods);
                res.json(results);
            }
        );

        /**
         * Complete orders
         */
        this.router.put(
            '/:newStatus',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const orders = req.body;
                const status = req.params.newStatus;
                const results = await this.orderService.updateStatusOfOrdersInBulk(orders, status);
                res.json(results);
            }
        );
    }
}

export default Controller;
