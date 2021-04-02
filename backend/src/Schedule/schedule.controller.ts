import { Router, Request, Response } from 'express';
import passport from 'passport';

import ScheduleService from './schedule.service';

class Controller {
    public path = '/schedule';
    public router = Router();
    private scheduleService: ScheduleService;

    constructor(scheduleService?: ScheduleService) {
        this.initRoutes();
        this.scheduleService = scheduleService || new ScheduleService();
    }

    private initRoutes() {
        /**
         * Get all the schedules
         */
        this.router.get(
            '/',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const results = await this.scheduleService.getAllSchedule();
                res.json(results);
            }
        );
    }
}

export default Controller;
