import { Router, Request, Response } from 'express';
import passport from 'passport';

import GoodService from './good.service';

class Controller {
    public path = '/good';
    public router = Router();
    private goodService: GoodService;

    constructor(goodService?: GoodService) {
        this.initRoutes();
        this.goodService = goodService || new GoodService();
    }

    private initRoutes() {
        /**
         * Get all the goods
         */
        this.router.get(
            '/',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const results = await this.goodService.getAllGoods();
                res.json(results);
            }
        );

        /**
         * Get a good by id
         */
        this.router.get(
            '/id/:id',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const id = req.params.id;
                const results = await this.goodService.getSingleGood(Number(id));
                res.json(results);
            }
        );

        /**
         * Get all goods of type
         */
        this.router.get(
            '/type/:type',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const type = req.params.type;
                const results = await this.goodService.getAllGoodsOfType(type);
                res.json(results);
            }
        );

        /**
         * Get all archived goods of type
         */
        this.router.get(
            '/archive/type/:type',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const type = req.params.type;
                const results = await this.goodService.getAllArchivedGoodsOfType(type);
                res.json(results);
            }
        );

        /**
         * Archive or un archive multiple goods
         */
        this.router.post(
            '/archive',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const goods = req.body;
                const results = await this.goodService.archiveMultipleGoods(goods);
                res.json(results);
            }
        );

        /**
         * Add a single new good to the database
         */
        this.router.post(
            '/single',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const newGoods = req.body;
                const results = await this.goodService.addSingleGood(newGoods);
                res.json(results);
            }
        );

        // Add new goods
        this.router.post(
            '/',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const newGoods = req.body;
                const results = await this.goodService.addBulkGoods(newGoods);
                res.json(results);
            }
        );
    }
}

export default Controller;
