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
let userId = -1;
let commentId = -1;
let conferenceId = -1;
let talkId = -1;

const admin = {
    email: 'admin@gmail.com',
    jwt: null,
    hashedPassword: 'd82494f05d6917ba02f7aaa29689ccb444bb73f20380876cb05d1f37537b7892',
    password: 'adminadmin',
};

const users = [
    {
        email: 'user1@lgp.com',
        first_name: 'my',
        last_name: 'user',
        jwt: null,
        hashedPassword: '9f0448841901d1c7ecf548ccd859b7f80e9716de5fda7518d0923c898b4b7cce',
        password: 'umlemelhorquecertascoisas96',
    },
    {
        email: 'user2@lgp.com',
        first_name: 'your',
        last_name: 'user',
        jwt: null,
        hashedPassword: 'dontmatter',
        password: 'cantlogin',
    }
];

let userjwt = null;

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
    let values = "VALUES ";

    users.forEach(user => {
        values += `('${user.email}', '${user.hashedPassword}', '${user.first_name}', '${user.last_name}'), `;
    });
    values = values.substring(0, values.length-2);

    return db.query({
        text: `INSERT INTO users (email, pass, first_name, last_name)
               ${values}
               RETURNING id`
    }).then((res) => {
        userId = res.rows[0].id
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

describe('Register tests', () => {
    it('Registers new user', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'newuser@lgp.com',
                password: 'Lepassword1',
                first_name: 'frstnm',
                last_name: 'lstnm',
                work: 'wrk',
                work_field: 'wrkfld',
                home_town: 'hmtwn',
                university: 'uni'
            })
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                done();
            });
    });

    it('Registers new user', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'baduser@lgp.com',
                password: 'Yoldpass420',
                first_name: 'frstnma',
                last_name: 'lstnma',
                work: 'wrka',
                work_field: 'wrkflda',
                home_town: 'hmtwna',
                university: 'unia'
            })
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                done();
            });
    });
    
    it('Cannot register already registered user', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: 'Lepassword1',
                first_name: 'frstnm',
                last_name: 'lstnm',
                work: 'wrk',
                work_field: 'wrkfld',
                home_town: 'hmtwn',
                university: 'uni'
            })
            .expect(401)
            .end((err, res) => {
                done();
            });
    });
});

describe('Admin tests', () => {
    it('Login should be successful', (done) => {
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
            });
    });

    it('Should get all users', (done) => {
        request(app)
            .get('/admin/users')
            .set('authorization', 'Bearer ' + admin.jwt)
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.be.instanceOf(Object);
                expect(res.body[0]).to.have.property('email');
                expect(res.body[0]).to.have.property('date_created');
                expect(res.body[0]).to.have.property('isactive');
                done();
            });
    });

    describe('Ban/unban user', () => {
        it('Should not ban unexisting user (400)', (done) => {
            request(app)
            .post('/admin/ban')
            .set('authorization', 'Bearer ' + admin.jwt)
            .send({
                email: 'notanemail'
            })
            .expect(400)
            .end((err, res) => {
                done();
            });
        });
        
        it('Should ban user', (done) => {
            request(app)
                .post('/admin/ban')
                .set('authorization', 'Bearer ' + admin.jwt)
                .send({
                    email: 'baduser@lgp.com'
                })
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Should not allow banned user to login', (done) => {
            request(app)
                .post('/login')
                .send({
                    email: 'baduser@lgp.com',
                    password: 'Yoldpass420',
                })
                .expect(400)
                .end((err, res) => {
                    done();
                });
        });

        it('Should unban (200)', (done) => {
            request(app)
                .post('/admin/user')
                .send({ email: users[0].email })
                .set('authorization', 'Bearer ' + admin.jwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Should not unban unexistent user 400', (done) => {
            request(app)
                .post('/admin/user')
                .send({ email: "notanemail" })
                .set('authorization', 'Bearer ' + admin.jwt)
                .expect(400)
                .end((err, res) => {
                    done();
                });
        });
    });

    describe('Report tests', () => {
    });

    describe('Whitelist tests', () => {
        it('Shouldn\'t add bad email to the whitelist', (done) => {
            request(app)
                .post('/admin/users')
                .send({
                    email: 'aa',
                    userLevel: 'user',
                })
                .set('authorization', 'Bearer ' + admin.jwt)
                .expect(400)
                .end((err, res) => {
                    expect(res.body).to.be.instanceOf(Object);
                    expect(res.body).to.have.property('message');
                    done();
                });
        });

        it('Should add user to the whitelist', (done) => {
            request(app)
                .post('/admin/users')
                .send({
                    email: 'camachocosta@amadora.pt',
                    userLevel: 'user',
                })
                .set('authorization', 'Bearer ' + admin.jwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.body).to.be.instanceOf(Object);
                    expect(res.body).to.have.property('email');
                    done();
                });
        });

        it('Should remove user from the whitelist', (done) => {
            request(app)
                .delete('/admin/users')
                .send({
                    email: 'camachocosta@amadora.pt',
                })
                .set('authorization', 'Bearer ' + admin.jwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });
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

        it('Should remove admin (200)', (done) => {
            request(app)
                .post('/admin/user')
                .send({ email: users[0].email })
                .set('authorization', 'Bearer ' + admin.jwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });
    });
});

describe('User tests', () => {
    it('New user can log in', (done) => {
        request(app)
            .post('/login')
            .send({
                email: 'newuser@lgp.com',
                password: 'Lepassword1'
            })
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.be.instanceOf(Object);
                expect(res.body.token).to.be.string;
                userjwt = res.body.token;
                done();
            });
    });

    it('Should not allow user to ban', (done) => {
        request(app)
            .post('/admin/ban')
            .send({
                email: 'dontmatternotadmin'
            })
            .set('authorization', 'Bearer ' + userjwt)
            .expect(401)
            .end((err, res) => {
                    expect(res.body).to.be.instanceOf(Object);
                    expect(res.body.message).to.have.string(`You do not have permissions to ban a user`);
                done();
            });
    });
    
    it('Should not alow user to add admin permissions', (done) => {
        request(app)
            .post('/admin')
            .send({
                email: "nopermissions@lgp.com",
            })
            .set('authorization', 'Bearer ' + userjwt)
            .expect(401)
            .end((err, res) => {
                done();
            });
    });

    it('Should not allow user to unban/unadmin', (done) => {
        request(app)
            .post('/admin/user')
            .send({ email: users[0].email })
            .set('authorization', 'Bearer ' + userjwt)
            .expect(401)
            .end((err, res) => {
                done();
            });
    });

    describe('User interactions', () => {
        it('Get user interactions', (done) => {
            request(app)
                .post(`/users/${userId}/user_interactions`)
                .send({
                    observer: 8,
                    id: userId
                })
                .set('authorization', 'Bearer ' + userjwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Subscribe to another user', (done) => {
            request(app)
                .post(`/users/${userId}/subscription`)
                .send({
                    id: userId
                })
                .set('authorization', 'Bearer ' + userjwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Unsubscribe from another user', (done) => {
            request(app)
                .delete(`/users/${userId}/subscription`)
                .send({
                    id: userId
                })
                .set('authorization', 'Bearer ' + userjwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });
/*
        it('Rate a user', (done) => {
            request(app)
                .post(`/users/${userId}/rate`)
                .send({
                    rate: 4,
                    id: userId
                })
                .set('authorization', 'Bearer ' + userjwt)
                .expect(400)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });
*/
        it('Get profile', (done) => {
            request(app)
                .get(`/users/${userId}`)
                .send({
                    id: userId
                })
                .set('authorization', 'Bearer ' + userjwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Get notifications', (done) => {
            request(app)
                .get(`/users/${userId}/notifications`)
                .send({
                    id: userId
                })
                .set('authorization', 'Bearer ' + userjwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });
    });
});

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

    it('Should not submit an empty post', (done) => {
        request(app)
            .post('/post')
            .set('authorization', 'Bearer ' + admin.jwt)
            .send({
                author: publicPost.author,
                title: '',
                text: '',
                visibility: publicPost.visibility
            })
            .expect(400)
            .end((err, res) => {
                expect(res.body).to.be.instanceOf(Object);
                expect(res.body.message).to.have.string(`An error ocurred while creating a new post: Invalid post.`);
                done();
            });
    });

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
            });
    });

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
    });

    it('Should not edit if title is empty', (done) => {
        request(app)
            .put(`/post/${postId}`)
            .set('authorization', 'Bearer ' + admin.jwt)
            .send({
                author: editedPublicPost.author,
                title: '',
                text: '',
                visibility: editedPublicPost.visibility,
            })
            .expect(400)
            .end((err, res) => {
                expect(res.body).to.be.instanceOf(Object);
                expect(res.body.message).to.have.string(`An error ocurred while editing a post`);
                done();
            });
    });

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
    });

    it('Should get user-post interaction', (done) => {
        request(app)
            .post(`/post/${postId}/user_interactions`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                id: postId
            })
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                done();
            });
    });

    it('Should subscribe user to post', (done) => {
        request(app)
            .post(`/post/${postId}/subscription`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                id: postId
            })
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                done();
            });
    });

    it('Should unsubscribe user to post', (done) => {
        request(app)
            .delete(`/post/${postId}/subscription`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                id: postId
            })
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                done();
            });
    });

    it('Should not report a post without a reason', (done) => {
        request(app)
            .post(`/post/${postId}/report`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                post: postId,
                reason: '',
            })
            .expect(400)
            .end((err, res) => {
                expect(res.body).to.be.instanceOf(Object);
                expect(res.body.message).to.have.string(`An error ocurred while creating a new post report`);
                done();
            });
    });

    describe('Report tests', () => {
        it('Should report a post', (done) => {
            request(app)
                .post(`/post/${postId}/report`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    post: postId,
                    reason: 'i hate different oppinions'
                })
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.body).to.have.property('report');
                    expect(res.body.report === true);
                    done();
                });
        });

        it('Should check post report', (done) => {
            request(app)
                .get(`/post/${postId}/report`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    post: postId
                })
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Should not allow non admin users to get report notifications', (done) => {
            request(app)
                .get('/admin/notifications')
                .set('authorization', 'Bearer ' + userjwt)
                .expect(400)
                .end((err, res) => {
                    done();
                });
        });

        it('Should get notifications for admin', (done) => {
            request(app)
                .get('/admin/notifications')
                .set('authorization', 'Bearer ' + admin.jwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Should not allow non admin users to get amount of report notifications', (done) => {
            request(app)
                .get('/admin/amount_notifications')
                .set('authorization', 'Bearer ' + userjwt)
                .expect(400)
                .end((err, res) => {
                    done();
                });
        });

        it('Should get amount of report notifications for admin', (done) => {
            request(app)
                .get('/admin/amount_notifications')
                .set('authorization', 'Bearer ' + admin.jwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Should not allow non admin users to get report reasons', (done) => {
            request(app)
                .post('/admin/report_reasons')
                .set('authorization', 'Bearer ' + userjwt)
                .expect(400)
                .end((err, res) => {
                    done();
                });
        });

        it('Should get report reasons for admin', (done) => {
            request(app)
                .post('/admin/report_reasons')
                .set('authorization', 'Bearer ' + admin.jwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Should not allow non admin users to ignore report', (done) => {
            request(app)
                .post('/admin/ignore_reports')
                .set('authorization', 'Bearer ' + userjwt)
                .expect(400)
                .end((err, res) => {
                    done();
                });
        });

        it('Admin should ignore report', (done) => {
            request(app)
                .post('/admin/ignore_reports')
                .set('authorization', 'Bearer ' + admin.jwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });
    });

    it('Should invite user', (done) => {
        console.log('userID = ' + userId)
        request(app)
            .post(`/post/${postId}/invite`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                post: postId,
                invited_user: userId
            })
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                done();
            });
    });

    it('Should invite subscribers', (done) => {
        request(app)
            .post(`/post/${postId}/invite_subscribers`)
            .set('authorization', 'Bearer ' + admin.jwt)
            .send({
                post: postId,
            })
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                done();
            });
    });

    it('Should return amount of subscribers uninvited', (done) => {
        request(app)
            .post(`/post/${postId}/amount_uninvited_subscribers`)
            .set('authorization', 'Bearer ' + admin.jwt)
            .send({
                post: postId,
            })
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.have.property('amountUninvitedSubscribers');
                done();
            });
    });

    it('Should return information about uninvited users', (done) => {
        request(app)
            .post(`/post/${postId}/uninvited_users_info`)
            .set('authorization', 'Bearer ' + admin.jwt)
            .send({
                post: postId,
            })
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.have.property('uninvitedUsers');
                done();
            });
    });

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
    });

    describe('Comments tests', () => {
        it('Cannot comment on a post with an empty body', (done) => {
            request(app)
                .post(`/post/${postId}/comment`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    post_id: postId,
                    comment: ''
                })
                .expect(400)
                .end((err, res) => {
                    expect(res.body).to.have.property('message');
                    done();
                });
        });

        it('Should create a comment to a post', (done) => {
            request(app)
                .post(`/post/${postId}/comment`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    post_id: postId,
                    comment: 'comment to a post'
                })
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.body).to.have.property('id');
                    commentId = res.body.id;
                    done();
                });
        });

        it('Should not allow to comment with an empty body', (done) => {
            request(app)
                .post(`/post/${postId}/comment/`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    comment: ''
                })
                .expect(400)
                .end((err, res) => {
                    done();
                });
        });

        it('Should not add a comment to a comment', (done) => {
            request(app)
                .post(`/post/${postId}/comment/${commentId}`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    comment: ''
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                });
        });


        it('Should add a comment to a comment', (done) => {
            request(app)
                .post(`/post/${postId}/comment/${commentId}`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    comment: 'comment to a comment'
                })
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Should not allow to edit a comment with an empty body', (done) => {
            request(app)
                .put(`/post/${postId}/comment/${commentId}`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    comment: ''
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                });
        });
/*
        it('Should not allow to edit a comment', (done) => {
            request(app)
                .put(`/post/${postId}/comment/${commentId}`)
                .set('authorization', 'Bearer ' + admin.jwt)
                .send({
                    comment: 'cannot edit'
                })
                .expect(400)
                .end((err, res) => {
                    expect(res.body).to.be.instanceOf(Object);
                    expect(res.body.newComment).to.have.string(`cannot edit`);
                    !expect(err).to.be.null;
                    done();
                })
        });
*/
        it('Should edit a comment', (done) => {
            request(app)
                .put(`/post/${postId}/comment/${commentId}`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    comment: 'edited comment'
                })
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.body).to.be.instanceOf(Object);
                    expect(res.body.newComment).to.have.string(`edited comment`);
                    done();
                });
        });

        it('Should like a comment', (done) => {
            request(app)
                .post(`/post/${postId}/comment/${commentId}/like`)
                .set('authorization', 'Bearer ' + admin.jwt)
                .send({
                    id: commentId
                })
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Get who liked a comment', (done) => {
            request(app)
                .get(`/post/${postId}/comment/${commentId}/likes`)
                .set('authorization', 'Bearer ' + admin.jwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });
/*
        it('Should not unlike a comment', (done) => {
            request(app)
                .delete(`/post/${postId}/comment/${commentId}/like`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    id: commentId
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                })
        });
*/
        it('Should unlike a comment', (done) => {
            request(app)
                .delete(`/post/${postId}/comment/${commentId}/like`)
                .set('authorization', 'Bearer ' + admin.jwt)
                .send({
                    id: commentId
                })
                .expect(200)
                .end((err, res) => {
                    done();
                });
        });

        it('Should get comments of comments', (done) => {
            request(app)
                .get(`/post/${postId}/comment/${commentId}`)
                .set('authorization', 'Bearer ' + userjwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Should not report a comment without a reason', (done) => {
            request(app)
                .post(`/post/${postId}/comment/${commentId}/report`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    reason: ''
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    expect(res.body).to.be.instanceOf(Object);
                    expect(res.body.message).to.have.string(`An error ocurred while creating a new comment report`);
                    done();
                });
        });

        it('Should report a comment', (done) => {
            request(app)
                .post(`/post/${postId}/comment/${commentId}/report`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    reason: 'it offends me'
                })
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.body).to.be.instanceOf(Object);
                    expect(res.body.report);
                    done();
                });
        });

        it('Should check a comment report', (done) => {
            request(app)
                .get(`/post/${postId}/comment/${commentId}/report`)
                .set('authorization', 'Bearer ' + admin.jwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.body).to.be.instanceOf(Object);
                    expect(res.body.report);
                    done();
                });
        });
        
        it('Should delete the submitted comment', (done) => {
            request(app)
                .delete(`/post/${postId}/comment/${commentId}`)
                .set('authorization', 'Bearer ' + userjwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Should delete the submitted post', (done) => {
            request(app)
                .delete(`/post/${postId}`)
                .set('authorization', 'Bearer ' + admin.jwt)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('Should not find deleted post', (done) => {
            request(app)
                .get(`/post/${postId}`)
                .set('authorization', 'Bearer ' + admin.jwt)
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                });
        });
    });
});

describe('Conference tests', () => {
    it('Should not create conferece without title parameter' , (done) => {
        request(app)
            .post(`/conference`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                title: '',
                about: '',
                local: '',
                dateStart: '',
                dateEnd: '',
                avatar: '',
                privacy: 'public',
            })
            .expect(400)
            .end((err, res) => {
                !expect(err).to.be.null;
                done();
            });
    });

    it('Should not create conferece without about parameter' , (done) => {
        request(app)
            .post(`/conference`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                title: 'title',
                about: '',
                local: '',
                dateStart: '',
                dateEnd: '',
                avatar: '',
                privacy: 'public',
            })
            .expect(400)
            .end((err, res) => {
                !expect(err).to.be.null;
                done();
            });
    });

    it('Should not create conferece without local parameter' , (done) => {
        request(app)
            .post(`/conference`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                title: 'title',
                about: 'about',
                local: '',
                dateStart: '',
                dateEnd: '',
                privacy: 'public',
            })
            .expect(400)
            .end((err, res) => {
                !expect(err).to.be.null;
                done();
            });
    });

    it('Should not create conferece without dateStart parameter' , (done) => {
        request(app)
            .post(`/conference`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                title: 'title',
                about: 'about',
                local: 'local',
                dateStart: '',
                dateEnd: '',
                privacy: 'public',
            })
            .expect(400)
            .end((err, res) => {
                !expect(err).to.be.null;
                done();
            });
    });

    it('Should not create conferece without dateEnd parameter' , (done) => {
        request(app)
            .post(`/conference`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                title: 'title',
                about: 'about',
                local: 'local',
                dateStart: '2020-1-31',
                dateEnd: '1999-1-1',
                privacy: 'public',
            })
            .expect(400)
            .end((err, res) => {
                !expect(err).to.be.null;
                done();
            });
    });

    it('Should create conferece' , (done) => {
        request(app)
            .post(`/conference`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                title: 'title',
                about: 'about',
                local: 'local',
                dateStart: '31-1-2020',
                dateEnd: '31-3-2020',
                privacy: 'public',
            })
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.have.property('id');
                conferenceId = res.body.id;
                done();
            });
    });

    it('Should not edit conferece without title parameter' , (done) => {
        request(app)
            .put(`/conference/${conferenceId}`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                title: '',
                about: '',
                local: '',
                dateStart: '',
                dateEnd: '',
                avatar: '',
                privacy: 'public',
            })
            .expect(400)
            .end((err, res) => {
                !expect(err).to.be.null;
                done();
            });
    });

    it('Should not edit conferece without about parameter' , (done) => {
        request(app)
            .put(`/conference/${conferenceId}`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                title: 'title',
                about: '',
                local: '',
                dateStart: '',
                dateEnd: '',
                avatar: '',
                privacy: 'public',
            })
            .expect(400)
            .end((err, res) => {
                !expect(err).to.be.null;
                done();
            });
    });

    it('Should not edit conferece without local parameter' , (done) => {
        request(app)
            .put(`/conference/${conferenceId}`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                title: 'title',
                about: 'about',
                local: '',
                dateStart: '',
                dateEnd: '',
                privacy: 'public',
            })
            .expect(400)
            .end((err, res) => {
                !expect(err).to.be.null;
                done();
            });
    });

    it('Should not edit conferece without dateStart parameter' , (done) => {
        request(app)
            .put(`/conference/${conferenceId}`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                title: 'title',
                about: 'about',
                local: 'local',
                dateStart: '',
                dateEnd: '',
                privacy: 'public',
            })
            .expect(400)
            .end((err, res) => {
                !expect(err).to.be.null;
                done();
            });
    });

    it('Should not edit conferece without dateEnd parameter' , (done) => {
        request(app)
            .put(`/conference/${conferenceId}`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                title: 'title',
                about: 'about',
                local: 'local',
                dateStart: '2020-1-31',
                dateEnd: '1999-1-1',
                privacy: 'public',
            })
            .expect(400)
            .end((err, res) => {
                !expect(err).to.be.null;
                done();
            });
    });

    it('Should edit conferece' , (done) => {
        request(app)
            .put(`/conference/${conferenceId}`)
            .set('authorization', 'Bearer ' + userjwt)
            .send({
                title: 'title',
                about: 'about',
                local: 'local',
                dateStart: '2020-1-31',
                dateEnd: '2020-3-31',
                privacy: 'public',
            })
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                done();
            });
    });

    describe('Talk tests', () => {
        it('Should not create a talk without a title' , (done) => {
            request(app)
                .post(`/talk`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    title: '',
                    about: 'about',
                    local: 'local',
                    dateStart: '2020-1-31',
                    dateEnd: '2020-3-31',
                    privacy: 'public',
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                });
        });

        it('Should not create a talk without an about section' , (done) => {
            request(app)
                .post(`/talk`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    title: 'title',
                    about: '',
                    local: 'local',
                    dateStart: '2020-1-31',
                    dateEnd: '2020-3-31',
                    privacy: 'public',
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                });
        });

        it('Should not create a talk without a place discription' , (done) => {
            request(app)
                .post(`/talk`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    title: 'title',
                    about: 'about',
                    local: '',
                    dateStart: '2020-1-31',
                    dateEnd: '2020-3-31',
                    privacy: 'public',
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                });
        });

        it('Should not create a talk without a start date' , (done) => {
            request(app)
                .post(`/talk`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    title: 'title',
                    about: 'about',
                    local: 'local',
                    dateStart: '',
                    dateEnd: '2020-3-31',
                    privacy: 'public',
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                });
        });

        it('Should not create a talk without dateEnd parameter' , (done) => {
            request(app)
                .post(`/talk`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    title: 'title',
                    about: 'about',
                    local: 'local',
                    dateStart: '2020-1-31',
                    dateEnd: '1999-1-1',
                    privacy: 'public',
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                });
        });

        it('Should create a talk' , (done) => {
            request(app)
                .post(`/talk`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    title: 'title',
                    about: 'about',
                    local: 'local',
                    dateStart: '2020-1-31',
                    dateEnd: '2020-3-1',
                    livestream: 'https://www.youtube.com/watch?v=tNkZsRW7h2c',
                    privacy: 'public',
                })
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.body).to.have.property('id');
                    talkId = res.body.id;
                    done();
                });
        });

        it('Should not edit a talk without a title' , (done) => {
            request(app)
                .put(`/talk/${talkId}`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    title: '',
                    about: 'about',
                    local: 'local',
                    dateStart: '2020-1-31',
                    dateEnd: '2020-3-1',
                    privacy: 'public',
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                });
        });

        it('Should not edit a talk without an about section' , (done) => {
            request(app)
                .put(`/talk/${talkId}`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    title: 'title',
                    about: '',
                    local: 'local',
                    dateStart: '2020-1-31',
                    dateEnd: '2020-3-1',
                    privacy: 'public',
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                });
        });

        it('Should not edit a talk without a place discription' , (done) => {
            request(app)
                .put(`/talk/${talkId}`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    title: 'title',
                    about: 'about',
                    local: '',
                    dateStart: '2020-1-31',
                    dateEnd: '2020-3-31',
                    privacy: 'public',
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                });
        });

        it('Should not edit a talk without a start date' , (done) => {
            request(app)
                .put(`/talk/${talkId}`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    title: 'title',
                    about: 'about',
                    local: 'local',
                    dateStart: '',
                    dateEnd: '2020-3-31',
                    privacy: 'public',
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                });
        });

        it('Should not edit a talk without dateEnd parameter' , (done) => {
            request(app)
                .put(`/talk/${talkId}`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    title: 'title',
                    about: 'about',
                    local: 'local',
                    dateStart: '2020-1-31',
                    dateEnd: '1999-1-1',
                    privacy: 'public',
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                });
        });

        it('Should edit a talk' , (done) => {
            request(app)
                .put(`/talk/${talkId}`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    title: 'title2',
                    about: 'about2',
                    local: 'local2',
                    dateStart: '2020-1-30',
                    dateEnd: '2020-3-2',
                    livestream: 'https://www.youtube.com/watch?v=tNkZsRW7h2c',
                    privacy: 'public',
                })
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.body).to.have.property('id');
                    talkId = res.body.id;
                    done();
                });
        });
/*
        it('Should not invite a user to a talk if not the owner' , (done) => {
            request(app)
                .post(`/talk/${talkId}/invite`)
                .set('authorization', 'Bearer ' + admin.jwt)
                .send({
                    invited_user: userId+2,
                })
                .expect(400)
                .end((err, res) => {
                    !expect(err).to.be.null;
                    done();
                });
        });

        it('Should invite a user to a talk' , (done) => {
            request(app)
                .post(`/talk/${talkId}/invite`)
                .set('authorization', 'Bearer ' + userjwt)
                .send({
                    invited_user: userId+2,
                })
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    done();
                });
        });*/
    });
});

describe('Login tests', () => {
    it('Should not log if credentials don\'t exist' , (done) => {
        request(app)
            .post('/login')
            .send({
                email: 'made_up@email.com',
                password: 'madeUPpassword',
            })
            .expect(400)
            .end((err, res) => {
                done();
            });
    });
});

describe('Tag tests', () => {
    it('Should return all tags' , (done) => {
        request(app)
            .get('/tags')
            .set('authorization', 'Bearer ' + admin.jwt)
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                done();
            });
    });
});

describe('Feed tests', () => {
    it('Should get feed' , (done) => {
        request(app)
            .get('/feed')
            .send({
                offset: 10,
                limit: 10,
                userId: userId
            })
            .set('authorization', 'Bearer ' + userjwt)
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.have.property('posts');
                expect(res.body).to.have.property('size');
                expect(res.body).to.have.property('following');
                done();
            });
    });

    it('Should get feed' , (done) => {
        request(app)
            .get('/feed/get_stuff')
            .send({
                userId: userId
            })
            .set('authorization', 'Bearer ' + userjwt)
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.have.property('conferences');
                expect(res.body).to.have.property('following');
                done();
            });
    });
});
