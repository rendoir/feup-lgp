import * as jwt from 'express-jwt';

/**
 *  @return {any} this
 */
export function jwtMiddleware() {
    const secret = process.env.JWT_SECRET;
    return jwt({secret, isRevoked}).unless({
        path: [
            // public routes that don't require authentication
            '/login',
            '/register',
        ],
    });
}

/**
 *
 * @param req
 * @param payload
 * @param done Function with signature function(err, revoked)
 */
async function isRevoked(req, payload, done) {
    try {
        // verify if the user is in DB
        // const userId = payload.id;
        // const users = await query({
        //     text: `SELECT COUNT(*) FROM users
        //             WHERE id = $1`,
        //     values: [userId],
        // });

        // // revoke token if user no longer exists
        // if (users.rowCount === 0) {
        //     return done(null, true);
        // }

        // continue
        done(null, false);
    } catch (error) {
        console.log(error);
        return done(error, false);
    }
}
