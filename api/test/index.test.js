process.env.TEST = 'true';
const expect = require('chai').expect;
const app = require('../dist/index.js').app;
const request = require('supertest');
const db = require('../dist/db/db');
const dotenv = require("dotenv");

// now + 3 days
let futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 3);
const futureDateStr = '"' + futureDate.toISOString() + '"';

// let adminId = -1;

const publicPost = {
    author: -1,
    title: 'Test Title 1',
    text: 'Test Content 1',
    visibility: 'public'
};
function assignAuthorsToPosts(adminId) {
    publicPost.author = adminId;
}

function loadEnvironment() {
    if (process.env.PRODUCTION === 'true') {
        console.log('IN PROD');
        dotenv.config({ path: 'docker/prod.env' });
        dotenv.config({ path: 'docker/secrets.env' });
    }
    else {
        console.log('NOT IN PROD');
        dotenv.config({ path: '../../environment/dev.env' }); // dotenv is used to load env variables
        dotenv.config({ path: '../../secrets/secrets.env' });
    }
}

async function getTableNames() {
    return db.query({
        text: `SELECT table_name
                FROM information_schema.tables
                WHERE table_type = 'BASE TABLE'
                    AND table_schema NOT IN ('pg_catalog', 'information_schema');`
    });
}

function cleanTable(table) {
    db.query({
        text: `TRUNCATE ${table} CASCADE`, // cannot parameterize table names
    });
}

async function cleanDb() {
    try {
        const tableNames = await getTableNames();
        for (const row of tableNames.rows) {
            cleanTable(row.table_name);
        }
    } catch (error) {
        console.log(error);
    }
}

async function insertAdminUser() {
    return db.query({
        text: `INSERT INTO users (email, pass, first_name, last_name, permissions)
            VALUES ('admin@gmail.com','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Admin', 'Admina', 'admin')
            RETURNING id`,
    }).then((res) => res.rows[0].id);
}

before((done) => {
    loadEnvironment();
    cleanDb()
    .then(insertAdminUser)
    .then((adminId) => {
        assignAuthorsToPosts(adminId);
        return done();
    });
});

describe('Responds with error 404', () => {
    it('Should return an unauthorized response state', (done) => {
        request(app)
            .get('/unknown')
            // .set('authorization', 'Bearer ' + authToken)
            .expect(404)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.be.instanceOf(Object);
                expect(res.body.message).to.have.string(`Endpoint not found`);
                done();
            });
    });
});

describe('Root GET', () => {
    it('Should return a welcome message', (done) => {
        request(app)
            .get('/')
            // .set('authorization', 'Bearer ' + authToken)
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.text).to.have.string('welcome to node api');
                done();
            });
    });
});

describe('Create post', () => {
    it('Should submit a new public post', (done) => {
        request(app)
            .post('/post/create')
            .send(publicPost)
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.have.property('id');
                done();
            })
    });
});