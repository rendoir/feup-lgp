CREATE TYPE permission_level_enum AS ENUM (
    'admin',
    'user'
);

CREATE TABLE users (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    bio TEXT,
    email TEXT UNIQUE,
    pass TEXT,
    date_created TIMESTAMP DEFAULT NOW(),
    permissions permission_level_enum NOT NULL DEFAULT 'user'
);

CREATE TABLE follows (
    follower BIGINT REFERENCES users,
    followed BIGINT REFERENCES users
);

CREATE TABLE posts (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    author BIGINT REFERENCES users ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_image TEXT ARRAY,
    content_video TEXT ARRAY,
    content_document TEXT ARRAY,
    rate INTEGER NOT NULL DEFAULT 1 CONSTRAINT valid_rate CHECK (rate >= 1 AND rate <= 10),
    date_created TIMESTAMP DEFAULT NOW(),
    date_updated TIMESTAMP
);

CREATE TABLE comments (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    author BIGINT REFERENCES users ON DELETE CASCADE,
    post BIGINT REFERENCES posts ON DELETE CASCADE,
    comment TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT NOW(),
    date_updated TIMESTAMP
);

CREATE TABLE categories (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE posts_categories (
    post BIGINT REFERENCES posts ON DELETE CASCADE,
    category BIGINT REFERENCES categories ON DELETE CASCADE
);

CREATE TABLE posts_subscriptions (
    subscriber BIGINT REFERENCES users ON DELETE CASCADE,
    post BIGINT REFERENCES posts ON DELETE CASCADE
);

CREATE TABLE posts_rates (
    evaluator BIGINT REFERENCES users ON DELETE CASCADE,
    rate INTEGER NOT NULL CONSTRAINT valid_rate CHECK (rate >= 1 AND rate <= 10),
    post BIGINT REFERENCES posts ON DELETE CASCADE
);

INSERT INTO users (email, pass, first_name, last_name, permissions) VALUES ('admin@gmail.com','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Admin', 'Admina', 'admin');
INSERT INTO users (email, pass, first_name, last_name, permissions) VALUES ('user1@gmail.com','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'User', 'Doe', 'user');
INSERT INTO users (email, pass, first_name, last_name, permissions) VALUES ('user2@gmail.com','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'John', 'User', 'user');

INSERT INTO follows (follower, followed) VALUES (1, 2);

INSERT INTO posts (author, title, content, date_created) VALUES (1, 'Admin post', 'This is a post done by the admin', '2019-12-02');
INSERT INTO posts (author, title, content, date_created) VALUES (2, 'User post', 'This is a post done by a mere user following the admin', '2019-12-01');
INSERT INTO posts (author, title, content) VALUES (1, 'Admin post', 'This is a post done by the admin');
INSERT INTO posts (author, title, content) VALUES (2, 'User post', 'This is a post done by a mere user following the admin');
INSERT INTO posts (author, title, content) VALUES (1, 'Admin post', 'This is a post done by the admin');
INSERT INTO posts (author, title, content) VALUES (2, 'User post', 'This is a post done by a mere user following the admin');
INSERT INTO posts (author, title, content) VALUES (1, 'Admin post', 'This is a post done by the admin');
INSERT INTO posts (author, title, content) VALUES (2, 'User post', 'This is a post done by a mere user following the admin');
INSERT INTO posts (author, title, content) VALUES (1, 'Admin post', 'This is a post done by the admin');
INSERT INTO posts (author, title, content) VALUES (2, 'User post', 'This is a post done by a mere user following the admin');
INSERT INTO posts (author, title, content) VALUES (1, 'Admin post', 'This is a post done by the admin');
INSERT INTO posts (author, title, content) VALUES (2, 'User post', 'This is a post done by a mere user following the admin');
INSERT INTO posts (author, title, content) VALUES (1, 'Admin post', 'This is a post done by the admin');
INSERT INTO posts (author, title, content) VALUES (2, 'User post', 'This is a post done by a mere user following the admin');
INSERT INTO posts (author, title, content) VALUES (1, 'Admin post', 'This is a post done by the admin');
INSERT INTO posts (author, title, content) VALUES (2, 'User post', 'This is a post done by a mere user following the admin');
INSERT INTO posts (author, title, content) VALUES (1, 'Admin post', 'This is a post done by the admin');
INSERT INTO posts (author, title, content) VALUES (2, 'User post', 'This is a post done by a mere user following the admin');
INSERT INTO posts (author, title, content) VALUES (1, 'Admin post', 'This is a post done by the admin');
INSERT INTO posts (author, title, content) VALUES (2, 'User post', 'This is a post done by a mere user following the admin');
INSERT INTO posts (author, title, content) VALUES (1, 'Admin post', 'This is a post done by the admin');
INSERT INTO posts (author, title, content) VALUES (2, 'User post', 'This is a post done by a mere user following the admin');
INSERT INTO posts (author, title, content) VALUES (3, 'User post', 'This is a post done by a mere user');

INSERT INTO comments (author, post, comment) VALUES (1, 1, 'This is a comment done by the admin');
INSERT INTO comments (author, post, comment) VALUES (2, 2, 'This is a comment done by a mere user following the admin');
INSERT INTO comments (author, post, comment) VALUES (1, 3, 'This is a comment done by the admin');
INSERT INTO comments (author, post, comment) VALUES (2, 4, 'This is a comment done by a mere user following the admin');
INSERT INTO comments (author, post, comment) VALUES (1, 5, 'This is a comment done by the admin');
INSERT INTO comments (author, post, comment) VALUES (2, 6, 'This is a comment done by a mere user following the admin');
INSERT INTO comments (author, post, comment) VALUES (1, 7, 'This is a comment done by the admin');
INSERT INTO comments (author, post, comment) VALUES (2, 8, 'This is a comment done by a mere user following the admin');
INSERT INTO comments (author, post, comment) VALUES (1, 9, 'This is a comment done by the admin');
INSERT INTO comments (author, post, comment) VALUES (2, 10, 'This is a comment done by a mere user following the admin');
INSERT INTO comments (author, post, comment) VALUES (2, 1, 'This is a comment done by a mere user following the admin');
INSERT INTO comments (author, post, comment) VALUES (1, 2, 'This is a comment done by the admin');
INSERT INTO comments (author, post, comment) VALUES (2, 3, 'This is a comment done by a mere user following the admin');
INSERT INTO comments (author, post, comment) VALUES (1, 4, 'This is a comment done by the admin');
INSERT INTO comments (author, post, comment) VALUES (2, 5, 'This is a comment done by a mere user following the admin');
INSERT INTO comments (author, post, comment) VALUES (1, 6, 'This is a comment done by the admin');
INSERT INTO comments (author, post, comment) VALUES (2, 7, 'This is a comment done by a mere user following the admin');
INSERT INTO comments (author, post, comment) VALUES (1, 8, 'This is a comment done by the admin');
INSERT INTO comments (author, post, comment) VALUES (2, 9, 'This is a comment done by a mere user following the admin');
INSERT INTO comments (author, post, comment) VALUES (1, 10, 'This is a comment done by the admin');

INSERT INTO posts_subscriptions (subscriber, post) VALUES (1, 1);

INSERT INTO posts_rates (evaluator, rate, post) VALUES (1, 3, 1);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 5, 1);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 7, 1);