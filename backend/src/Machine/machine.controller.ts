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

        // Retrieve all machines corresponding to the given status.
        this.router.get(
            '/filter/:status',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const status = String(req.params.status);
                const result = await this.machineService.getAllMachinesByStatus(status);
                res.json(result);
            }
        );

        // Create new machine.
        this.router.post(
            '/',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                let message;

                try {
                    const result = await this.machineService.createNewMachine();
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
