import { Request } from 'express';
import { IUser } from '@models/User';


export const paramMissingError = 'One or more of the required parameters was missing.';

export interface IRequest extends Request {
    body: {
        user: IUser;
    }
} 
