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
    -- rate INTEGER NOT NULL DEFAULT 1 CONSTRAINT valid_rate CHECK (price >= 1 AND price <= 10),
    date_created TIMESTAMP DEFAULT NOW(),
    date_updated TIMESTAMP
);

CREATE TABLE files (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    mimeType TEXT NOT NULL,
    size INTEGER NOT NULL,
    post BIGINT REFERENCES posts ON DELETE CASCADE,
    UNIQUE (name, post)
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