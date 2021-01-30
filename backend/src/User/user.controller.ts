import { Router, Request, Response } from 'express';
import UserService from './user.service';

class Controller {
    public path = '/user';
    public router = Router();
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
        this.initRoutes();
    }

    private initRoutes() {
        // Retrieve all users.
        this.router.get('/', async (req: Request, res: Response) => {
            const result = await this.userService.getAllUsers();
            res.json(result);
        });

        // Create new user.
        this.router.post('/', async (req: Request, res: Response) => {
            const { name, email, role, password } = req.body;
            const result = await this.userService.createNewUser(name, role, email, password);
            res.json(result);
        });

        // Retrieve a single user with userID.
        this.router.get('/:userID', async (req: Request, res: Response) => {
            const id = Number(req.params.userID);
            const result = await this.userService.findUserById(id);
            res.json(result);
        });

        // Retrieve a single user with email and password.
        this.router.get('/auth/:email/:password', async (req: Request, res: Response) => {
            const email = req.params.email;
            const password = req.params.password;
            const result = await this.userService.findUserByAuth(email, password);
            res.json(result);
        });

        // Update a user with userID.
        this.router.put('/:userID', async (req: Request, res: Response) => {
            const id = Number(req.params.userID);
            const { name, email, role, password } = req.body;
            const result = await this.userService.updateUser(id, name, role, email, password);
            res.json(result);
        });

        // Delete a user with userID.
        this.router.delete('/:userID', async (req: Request, res: Response) => {
            const id = Number(req.params.userID);
            const result = await this.userService.deleteUser(id);
            res.json(result);
        });


        // Delete all users.
        this.router.delete('/', async (req: Request, res: Response) => {
            const result = await this.userService.deleteAll();
            res.json(result);
        });
    }
}

export default Controller;