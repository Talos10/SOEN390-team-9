import { config } from '../../config';
import UserModel from '../User/user.model';
import logger from './Logger';

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt_public_key,
    ignoreExpiration: false,
    passReqToCallback: false,
}


passport.use(new JwtStrategy(options, async function (jwtPayload: any, done: any) {
    try {
        // If we are here, the token is valid (expiry date, payload)

        // Now we check the database, but we could skip and trust the token
        const user = await UserModel.findById(jwtPayload.id);
        if (user) {
            logger.debug('Token verified')
            return done(null, user, jwtPayload);
        } else {
            logger.warn('User not found from token id')
            return done(new Error("User not found from token id"));
        }
    } catch (error) {
        return done(error);
    }
}));