import { Router, Request, Response } from 'express';
import passport from 'passport';

import PlanningService from './planning.service';

class Controller {
    public path = '/planning';
    public router = Router();
    private planningService: PlanningService;

    constructor(planningService: any = null) {
        this.planningService = planningService || new PlanningService();
        this.initRoutes();
    }

    private initRoutes() {
        /**
         * Get all the events
         */
        this.router.get(
            '/events',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const result = await this.planningService.getAllEvents();
                res.json(result);
            }
        );

        /**
         * Create a new event
         */
        this.router.post(
            '/newEvent',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const newEvent = req.body;
                const result = await this.planningService.addEvent(newEvent);
                res.json(result);
            }
        );

       /**
        * Delete an existing event
        */
       this.router.delete(
            '/event/:eventId',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const eventId = Number(req.params.eventId);
                const result = await this.planningService.deleteEvent(eventId);
                res.json(result);
            }
        );

        /**
         * Get all goals
         */
        this.router.get(
            '/goals',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const result = await this.planningService.getAllGoals();
                res.json(result);
            }
        );

        /**
         * Create a new goal
         */
        this.router.post(
            '/newGoal',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const newGoal = req.body;
                const result = await this.planningService.addGoal(newGoal);
                res.json(result);
            }
        );

        /**
         * Delete an existing goal
         */
        this.router.delete(
            '/goal/:goalId',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const goalId = Number(req.params.goalId);
                const result = await this.planningService.deleteGoal(goalId);
                res.json(result);
            }
        );

        /**
         * Update an existing goal (mark it as complete)
         */
        this.router.put(
            '/:goalId',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const id = Number(req.params.goalId);
                const { completed, targetDate, title } = req.body;
                const result = await this.planningService.updateGoal(id, completed, targetDate, title);
                res.json(result);
            }
        );

    }
}

export default Controller;
