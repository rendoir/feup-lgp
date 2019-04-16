'use strict';
import {Pool, QueryConfig, QueryResult} from 'pg';

const DB_HOST = process.env.DB_HOST != null ? process.env.DB_HOST : 'localhost';

const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    port: +process.env.DB_PORT,
    max: 5, // max number of clients in the pool
    idleTimeoutMillis: 30000, // number of milliseconds a client must sit idle in the pool and not be checked out
};

const pool = new Pool(dbConfig);

pool.on('error', (err) => {
    console.error('An idle client has experienced an error');
});

/**
 *
 * @param sql
 */
export function query(sql: QueryConfig): Promise<QueryResult> {
    return new Promise<QueryResult>((resolve, reject) => {
        tryConnection(sql, 3, (err, result) => {
            if (err) { reject(err); } else { resolve(result); }
        });
    });
}
/**
 * Try to connect and make a query
 * @param {*} sql SQL to run
 * @param {*} cb Callback
 * @param {*} numTries Number of tries left
 */
function tryConnection(sql: QueryConfig, numTries: number, cb: (err, result) => void) {
    const connectionTimeout = 5;
    if (numTries > 0) {
        pool.connect().then(
            (client) => {
                return client.query(sql).then(
                    (res) => {
                        client.release();
                        cb(null, res);
                    },
                ).catch((err) => {
                    client.release();
                    cb(err, null);
                });
            }).catch((err) => {
                console.log(dbConfig);
                console.log(err);
                console.log(`Connection broken. Retrying in ${connectionTimeout}s`);
                setTimeout(() => tryConnection(sql, numTries - 1, cb), connectionTimeout * 1000);
            });
    } else {
        cb('Could not connect to database', null);
    }
}
