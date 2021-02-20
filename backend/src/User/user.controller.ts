import { Router, Request, Response } from 'express';
import UserService from './user.service';
import passport from 'passport';
import auth from 'basic-auth';
import { requireParams, isNotNUllUndefinedEmpty } from '../shared/middleware/paramsChecker';

class Controller {
    public path = '/user';
    public router = Router();
    private userService: UserService;

    constructor(userService: any = null) {
        this.userService = userService || new UserService();
        this.initRoutes();
        this.initInitialAdminAccount();
    }

    private async initInitialAdminAccount() {
        const users = await this.userService.getAllUsers();
        if (users.length === 0) {
            // Create the initial admin account if there are no users in db
            this.userService.createNewUser('Admin', 'Admin', 'admin@email.com', 'admin');
        }
    }

    private initRoutes() {
        // Login user
        this.router.post('/login', async (req: Request, res: Response) => {
            const user = auth(req);
            const name = user?.name;
            const pass = user?.pass;

            const result = await this.userService.loginUser(name, pass);

            res.json(result);
        });

        // Email recovery
        this.router.post(
            '/forgot',
            requireParams(['email']),
            async (req: Request, res: Response) => {
                const { email } = req.body;
                const result = await this.userService.sendForgotPassword(email);

                res.json(result);
            }
        );

        // Reset password
        this.router.post('/reset/', async (req: Request, res: Response) => {
            const user = auth(req);
            const token = user?.name;
            const pass = user?.pass;
            const result = await this.userService.resetPassword(token, pass);

            res.json(result);
        });

        // Retrieve all users.
        this.router.get(
            '/',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                console.log(req);
                const result = await this.userService.getAllUsers();
                res.json(result);
            }
        );

        // Create new user.
        this.router.post(
            '/',
            requireParams(['name', 'email', 'role', 'password']),
            isNotNUllUndefinedEmpty(['name', 'email', 'role', 'password']),
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const { name, email, role, password } = req.body;
                const result = await this.userService.createNewUser(name, role, email, password);
                res.json(result);
            }
        );

        // Retrieve a single user with userID.
        this.router.get(
            '/:userID',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const id = Number(req.params.userID);
                const result = await this.userService.findUserById(id);
                res.json(result);
            }
        );

        // Update a user with userID.
        this.router.put(
            '/:userID',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const id = Number(req.params.userID);
                const { name, email, role, password } = req.body;
                const result = await this.userService.updateUser(id, name, role, email, password);
                res.json(result);
            }
        );

        // Delete a user with userID.
        this.router.delete(
            '/:userID',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const id = Number(req.params.userID);
                const result = await this.userService.deleteUser(id);
                res.json(result);
            }
        );

        // Delete all users.
        this.router.delete(
            '/',
            passport.authenticate('jwt', { session: false }),
            async (req: Request, res: Response) => {
                const result = await this.userService.deleteAll();
                res.json(result);
            }
        );
    }
}

export default Controller;
