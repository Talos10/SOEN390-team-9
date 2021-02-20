import { config } from '../../config';
import logger from './Logger';

import passport from 'passport';
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt_public_key,
    ignoreExpiration: false,
    passReqToCallback: false
};

passport.use(
    new JwtStrategy(options, async (jwtPayload: any, next: any) => {
        // If we are here, the token is valid (expiry date, payload)
        logger.debug('Token verified');

        // We return the jwtPayload to the controller which can retrieve it using req.user
        return next(null, jwtPayload);
    })
);

passport.use(
    'jwtAdmin',
    new JwtStrategy(options, async (jwtPayload: any, next: any) => {
        // If we are here, the token is valid (expiry date, payload)
        if (jwtPayload.role !== config.user.role.admin) {
            logger.debug('User is not an admin');
            next(null, false, { message: 'User is not an admin' });
            return;
        }
        logger.debug('Token verified as admin');

        // We return the jwtPayload to the controller which can retrieve it using req.user
        return next(null, jwtPayload);
    })
);
