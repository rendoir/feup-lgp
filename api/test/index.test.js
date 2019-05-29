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

const admin = {
    email: 'admin@gmail.com',
    jwt: null,
    hashedPassword: 'd82494f05d6917ba02f7aaa29689ccb444bb73f20380876cb05d1f37537b7892',
    password: 'adminadmin',
};

const users = [{
    email: 'user1@lgp.com',
    first_name: 'my',
    last_name: 'user',
    jwt: null,
    hashedPassword: '9f0448841901d1c7ecf548ccd859b7f80e9716de5fda7518d0923c898b4b7cce',
    password: 'umlemelhorquecertascoisas96',
}];

const publicPost = {
    author: -1,
    title: 'Test Title 1',
    text: 'Test Content 1',
    visibility: 'public',
};
const editedPublicPost = {
    author: -1,
    title: 'Edited Title 1',
    text: 'Edited Content 1',
    visibility: 'followers',
}
function assignAuthorsToPosts(adminId) {
    publicPost.author = adminId;
    editedPublicPost.author = adminId;
}

/**
 * Posts aren't compared immediately due to DB posts containing more attributes
 * and lacking the author's id.
 * @param {*} p1 
 * @param {*} p2 
 */
function equalPosts(p1, p2) {
    return p1.title == p2.title
        && p1.text == p2.content
        && p1.visibility == p2.visibility;
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
                    AND table_schema NOT IN ('pg_catalog', 'information_schema')`
    });
}

function cleanTable(table) {
    return db.query({
        text: `TRUNCATE ${table} CASCADE`, // cannot parameterize table names
    });
}

async function cleanDb() {
    try {
        const tableNames = await getTableNames();
        const promises = [];
        for (const row of tableNames.rows) {
            promises.push(cleanTable(row.table_name));
        }
        await Promise.all(promises);
    } catch (error) {
        console.error(error);
    }
}

async function insertUsers() {
    let values = "";

    users.forEach(user => {
        values += `VALUES ('${user.email}', '${user.hashedPassword}', '${user.first_name}', '${user.last_name}'), `;
    });
    values = values.substring(0, values.length-2);

    return db.query({
        text: `INSERT INTO users (email, pass, first_name, last_name)
               ${values}`
    });
}

async function insertAdminUser() {
    return db.query({
        text: `INSERT INTO users (email, pass, first_name, last_name, permissions)
            VALUES ($1, $2, 'Admin', 'Admina', 'admin')
            RETURNING id`,
        values: [admin.email, admin.hashedPassword],
    }).then((res) => res.rows[0].id);
}

before(function(done) {
    this.timeout(0);
    loadEnvironment();
    cleanDb()
    .then(insertUsers)
    .then(insertAdminUser)
    .then((adminId) => {
        assignAuthorsToPosts(adminId);
        return done();
    })
    .catch(err => console.log(err));
});

describe('Admin login', () => {
    it('Should be successful', (done) => {
        request(app)
            .post('/login')
            .send({
                email: admin.email,
                password: admin.password,
            })
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.be.instanceOf(Object);
                expect(res.body.token).to.be.string;
                admin.jwt = res.body.token;
                done();
            })
    })
})

describe('Responds with error 404', () => {
    it('Should return an unauthorized response state', (done) => {
        request(app)
            .get('/unknown')
            .set('authorization', 'Bearer ' + admin.jwt)
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
            .set('authorization', 'Bearer ' + admin.jwt)
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.text).to.have.string('welcome to node api');
                done();
            });
    });
});

describe('Post', () => {
    let postId = -1;

    it('Should submit a new public post', (done) => {
        request(app)
            .post('/post')
            .set('authorization', 'Bearer ' + admin.jwt)
            .send(publicPost)
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.have.property('id');
                postId = res.body.id;
                done();
            })
    })

    it('Should retrieve the submitted post', (done) => {
        request(app)
            .get(`/post/${postId}`)
            .set('authorization', 'Bearer ' + admin.jwt)
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.have.property('post');
                expect(equalPosts(publicPost, res.body.post)).to.be.true;
                expect(res.body).to.have.property('comments');
                expect(res.body.comments).to.be.empty;
                done();
            });
    })

    it('Should edit the submitted post', (done) => {
        request(app)
            .put(`/post/${postId}`)
            .set('authorization', 'Bearer ' + admin.jwt)
            .send(editedPublicPost)
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                done();
            });
    })

    it('Should retrieve the edited post', (done) => {
        request(app)
            .get(`/post/${postId}`)
            .set('authorization', 'Bearer ' + admin.jwt)
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.have.property('post');
                expect(equalPosts(editedPublicPost, res.body.post)).to.be.true;
                expect(res.body).to.have.property('comments');
                expect(res.body.comments).to.be.empty;
                done();
            });
    })

    it('Should delete the submitted post', (done) => {
        request(app)
            .delete(`/post/${postId}`)
            .set('authorization', 'Bearer ' + admin.jwt)
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                done();
            })
    })

    it('Should not find deleted post', (done) => {
        request(app)
            .get(`/post/${postId}`)
            .set('authorization', 'Bearer ' + admin.jwt)
            .expect(400)
            .end((err, res) => {
                expect(err).to.be.null;
                done();
            })
    })
});

describe('Add Admin', () => {
    it('Should add the user as admin', (done) => {
        request(app)
            .post('/admin')
            .send({
                email: users[0].email,
            })
            .set('authorization', 'Bearer ' + admin.jwt)
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                done();
            });
    });

    it('Should not add the user as admin (no permissions)', (done) => {
        request(app)
            .post('/admin')
            .send({
                email: "nopermissions@lgp.com",
            })
            .expect(401)
            .end((err, res) => {
                done();
            });
    });

    it('Should not add the user as admin (no user found)', (done) => {
        request(app)
            .post('/admin')
            .send({
                email: "nouserfound@lgp.com",
            })
            .set('authorization', 'Bearer ' + admin.jwt)
            .expect(400)
            .end((err, res) => {
                done();
            });
    });
});
