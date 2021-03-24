import { Router, Request, Response } from 'express';
import MachineService from './machine.service';
import passport from 'passport';
import { requireParams, isNotNUllUndefinedEmpty } from '../shared/middleware/paramsChecker';

class Controller {
    public path = '/machine';
    public router = Router();
    private machineService: MachineService;

    constructor(machineService: any = null) {
        this.machineService = machineService || new MachineService();
        this.initRoutes();
    }

    private initRoutes() {
        // Retrieve all machines.
        this.router.get(
            '/',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const result = await this.machineService.getAllMachines();
                res.json(result);
            }
        );

        // Create new machine.
        this.router.post(
            '/',
            requireParams(['status', 'numberOrderCompleted']),
            isNotNUllUndefinedEmpty(['status', 'numberOrderCompleted']),
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const { status, numberOrderCompleted } = req.body;
                var message;

                try {
                    const result = await this.machineService.createNewMachine(
                        status,
                        numberOrderCompleted
                    );
                    message = {
                        id: result,
                        status: true,
                        message: 'Machine was created successfully.'
                    };
                } catch (e) {
                    message = {
                        status: false,
                        message: e as string
                    };
                }

                res.json(message);
            }
        );

        // Retrieve a single machine with machineId.
        this.router.get(
            '/:machineId',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const id = Number(req.params.machineId);
                const result = await this.machineService.findMachineById(id);
                res.json(result);
            }
        );

        // Update a machine with machineId.
        this.router.put(
            '/:machineId',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const id = Number(req.params.machineId);
                const { status, numberOrderCompleted } = req.body;
                const result = await this.machineService.updateMachine(
                    id,
                    status,
                    numberOrderCompleted
                );
                res.json(result);
            }
        );

        // Delete a machine with machineId.
        this.router.delete(
            '/:machineId',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const id = Number(req.params.machineId);

                var message;

                try {
                    const result = await this.machineService.deleteMachine(id);
                    message = {
                        id: result,
                        status: true,
                        message: 'Machine was successfully deleted.'
                    };
                } catch (e) {
                    message = {
                        status: false,
                        message: e as string
                    };
                }

                res.json(message);
            }
        );

        // Delete all machines.
        this.router.delete(
            '/',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                var message;

                try {
                    const result = await this.machineService.deleteAll();
                    message = {
                        id: result,
                        status: true,
                        message: 'All machines were successfully deleted.'
                    };
                } catch (e) {
                    message = {
                        status: false,
                        message: e as string
                    };
                }

                res.json(message);
            }
        );

        // Schedule machine
        this.router.post(
            '/schedule',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const ids = req.body;
                const results = await this.machineService.scheduleMachine(
                    ids.machineId,
                    ids.orderId
                );
                res.json(results);
            }
        );

        // Schedule machine
        this.router.post(
            '/schedule/complete',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const ids = req.body;
                const results = await this.machineService.freeMachine(ids.machineId, ids.orderId);
                res.json(results);
            }
        );
    }
}

export default Controller;
