'use strict';

import { json, urlencoded } from 'body-parser';
// import * as cookie_parser from 'cookie-parser';
import { config } from 'dotenv';
import * as express from 'express';
import * as express_session from 'express-session';
import * as fs from 'fs';
import * as https from 'https';
import * as morgan from 'morgan';
import { jwtMiddleware } from './_helpers/jwt';
let privateKey; let certificate;

if (process.env.PRODUCTION === 'true') {
    console.log('IN PROD');
    config({path: 'docker/environment.env'});
    config({path: 'docker/secrets.env'});
    privateKey = fs.readFileSync('docker/api.key', 'utf8');
    certificate = fs.readFileSync('docker/api.crt', 'utf8');
} else {
    console.log('NOT IN PROD');
    config({ path: '../environment/environment.env' }); // dotenv is used to load env variables
    config({ path: '../secrets/secrets.env' });
    privateKey = fs.readFileSync('../secrets/api.key', 'utf8');
    certificate = fs.readFileSync('../secrets/api.crt', 'utf8');
}
const credentials = { key: privateKey, cert: certificate };

import {
    adminRouter,
    feedRouter,
    loginRouter,
    postRouter,
    usersRouter,
} from './routes/routes';
// Create a new Express application.
export const app = express();

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(morgan('combined'));
// app.use(cookie_parser());
app.use(urlencoded({extended: true}));
app.use(json());
app.use(express_session({secret: 'keyboard cat', resave: true, saveUninitialized: true}));
app.use(express.static('uploads'));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    next();
});

// Uncomment the following line when login is implemented.
// app.use(jwtMiddleware());

// Define routes.
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/feed', feedRouter);
app.use('/post', postRouter);
app.use('/admin', adminRouter);
app.get('/', (req, res) => {
    res.send('welcome to node api');
});

// no endpoint previous route matched so return 404
app.use((req, res, next) => {
    const err = new Error();
    err.name = 'NotFoundError';
    next(err);
});

// error handling middleware
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ message: err.message });
    } else if (err.name === 'NotFoundError') {
        res.status(404).send({ message: 'Endpoint not found' });
    } else {
        console.error('API UNCAUGHT ERROR:', err);
        res.status(500).send({ message: 'Internal server error'});
    }
});

console.log('PORT: ' + process.env.API_PORT);
https.createServer(credentials, app).listen(process.env.API_PORT);
