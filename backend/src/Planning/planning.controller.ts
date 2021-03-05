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

        // Retrieve all events
        this.router.get(
            '/events',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const result = await this.planningService.getAllEvents();
                res.json(result);
            }
        );

        // Create new event
        this.router.post(
            '/newEvent',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const newEvent = req.body;
                const result = await this.planningService.addEvent(newEvent);
                res.json(result);
            }
        );

       // Delete an event
       this.router.delete(
            '/:eventId',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const eventId = Number(req.params.id);
                const result = await this.planningService.deleteEvent(eventId);
                res.json(result);
            }
        );

    // Retrieve all goals
    this.router.get(
        '/goals',
        passport.authenticate('jwt', { session: false }),
        async (req: Request, res: Response) => {
            const result = await this.planningService.getAllGoals();
            res.json(result);
        }
    );

     // Create new goal
     this.router.post(
        '/newGoal',
        passport.authenticate('jwt', { session: false }),
        async (req: Request, res: Response) => {
            const newGoal = req.body;
            const result = await this.planningService.addGoal(newGoal);
            res.json(result);
        }
    );

     // Delete a goal
     this.router.delete(
        '/:goalId',
        passport.authenticate('jwt', { session: false }),
        async (req: Request, res: Response) => {
            const goalId = Number(req.params.id);
            const result = await this.planningService.deleteGoal(goalId);
            res.json(result);
        }
    );

    // Update a goal
    this.router.put(
        '/:goalId',
        passport.authenticate('jwt', { session: false }),
        async (req: Request, res: Response) => {
            const id = Number(req.params.id);
            const updatedGoal = req.body;
            const result = await this.planningService.updateGoal(updatedGoal);
            res.json(result);
        }
    );

    }
}

export default Controller;
