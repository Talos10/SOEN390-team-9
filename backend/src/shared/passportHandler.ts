import { config } from '../../config';
import UserModel from '../User/user.model';

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
        console.log('here')
        const user = await UserModel.findById(jwtPayload.id);
        if (user) {
            return done(null, user, jwtPayload);
        } else {
            return done(new Error("User not found from token id"));
        }
    } catch (error) {
        return done(error);
    }
}));