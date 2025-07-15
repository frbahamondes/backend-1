// src/config/passport.config.js
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const UserModel = require('../models/user.model');

const JWT_SECRET = 'coderSecretJWT123'; // ⚠️ Idealmente pásalo al archivo .env

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
};

// 🎯 Estrategia JWT
passport.use('jwt', new JwtStrategy(options, async (jwt_payload, done) => {
    try {
        const user = await UserModel.findById(jwt_payload.id);

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

module.exports = passport;