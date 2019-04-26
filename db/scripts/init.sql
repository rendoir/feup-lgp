CREATE TYPE permission_level_enum AS ENUM (
    'admin',
    'user'
);

CREATE TYPE visibility_enum AS ENUM (
    'public',
    'followers',
    'private'
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
    visibility visibility_enum NOT NULL DEFAULT 'public',
    likes BIGINT DEFAULT 0,
    date_created TIMESTAMP DEFAULT NOW(),
    date_updated TIMESTAMP
);

CREATE TABLE comments (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    author BIGINT REFERENCES users ON DELETE CASCADE,
    post BIGINT REFERENCES posts ON DELETE CASCADE,
    comment_ref BIGINT REFERENCES comments ON DELETE CASCADE,
    comment TEXT NOT NULL,
    likes BIGINT DEFAULT 0,
    date_created TIMESTAMP DEFAULT NOW(),
    date_updated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE posts_categories (
    post BIGINT REFERENCES posts ON DELETE CASCADE,
    category BIGINT REFERENCES categories ON DELETE CASCADE
);

CREATE TABLE likes_a_comment (
    comment BIGINT REFERENCES comments ON DELETE CASCADE,
    author BIGINT REFERENCES users ON DELETE CASCADE
);

/**
* Likes on a Comment
*/
ALTER TABLE IF EXISTS ONLY likes_a_comment
    ADD CONSTRAINT likes_a_comment_pkey PRIMARY KEY (comment, author);

CREATE FUNCTION update_likes_comment() RETURNS trigger 
    LANGUAGE plpgsql
    AS $$BEGIN
        UPDATE comments SET likes = likes + 1 WHERE id = NEW.comment;
        RETURN NEW;
    END$$;

CREATE TRIGGER update_likes_of_a_comment
    AFTER INSERT ON likes_a_comment
    FOR EACH ROW
    EXECUTE PROCEDURE update_likes_comment();

CREATE FUNCTION delete_likes_comment() RETURNS trigger 
    LANGUAGE plpgsql
    AS $$BEGIN
        UPDATE comments SET likes = likes - 1 WHERE id = OLD.comment;
        RETURN NEW;
    END$$;

CREATE TRIGGER delete_likes_of_a_comment
    AFTER DELETE ON likes_a_comment
    FOR EACH ROW
    EXECUTE PROCEDURE delete_likes_comment();

/**
* Likes on a Post
*/
CREATE TABLE likes_a_post (
    post BIGINT REFERENCES posts ON DELETE CASCADE,
    author BIGINT REFERENCES users ON DELETE CASCADE
);

ALTER TABLE IF EXISTS ONLY likes_a_post
    ADD CONSTRAINT likes_a_post_pkey PRIMARY KEY (post, author);

CREATE FUNCTION update_likes_post() RETURNS trigger 
    LANGUAGE plpgsql
    AS $$BEGIN
        UPDATE posts SET likes = likes + 1 WHERE id = NEW.post;
        RETURN NEW;
    END$$;

CREATE TRIGGER update_likes_of_a_post
    AFTER INSERT ON likes_a_post
    FOR EACH ROW
    EXECUTE PROCEDURE update_likes_post();

CREATE FUNCTION delete_likes_post() RETURNS trigger 
    LANGUAGE plpgsql
    AS $$BEGIN
        UPDATE posts SET likes = likes - 1 WHERE id = OLD.post;
        RETURN NEW;
    END$$;

CREATE TRIGGER delete_likes_of_a_post
    AFTER DELETE ON likes_a_post
    FOR EACH ROW
    EXECUTE PROCEDURE delete_likes_post();


INSERT INTO users (email, pass, first_name, last_name, permissions) VALUES ('admin@gmail.com','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Admin', 'Admina', 'admin');
INSERT INTO users (email, pass, first_name, last_name, permissions) VALUES ('user1@gmail.com','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'User', 'Doe', 'user');
INSERT INTO users (email, pass, first_name, last_name, permissions) VALUES ('user2@gmail.com','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'John', 'User', 'user');

INSERT INTO follows (follower, followed) VALUES (1, 2);

INSERT INTO posts (author, title, content, visibility, date_created) VALUES (2, 'User post', 'This post should NOT be visible', 'private', '2019-12-03');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (3, 'User post', 'This post should NOT be visible in feed of user 1', 'public', '2019-12-03');
INSERT INTO posts (author, title, content, date_created) VALUES (1, 'Admin post', 'This is a post done by the admin', '2019-12-02');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (2, 'User post', 'This is a post done by a mere user following the admin', 'followers', '2019-12-01');
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


/* SECOND LEVEL COMMENTS */
INSERT INTO comments (author, post, comment_ref, comment) VALUES (1, 10, 1, 'This is a 2nd level comment done by the admin 1');
INSERT INTO comments (author, post, comment_ref, comment) VALUES (1, 10, 1, 'This is a 2nd level comment done by the admin 2');
INSERT INTO comments (author, post, comment_ref, comment) VALUES (1, 10, 1, 'This is a 2nd level comment done by the admin 3');
INSERT INTO comments (author, post, comment_ref, comment) VALUES (1, 10, 1, 'This is a 2nd level comment done by the admin 4');
INSERT INTO comments (author, post, comment_ref, comment) VALUES (1, 10, 1, 'This is a 2nd level comment done by the admin 5');
INSERT INTO comments (author, post, comment_ref, comment) VALUES (1, 10, 1, 'This is a 2nd level comment done by the admin 6');
INSERT INTO comments (author, post, comment_ref, comment) VALUES (1, 10, 1, 'This is a 2nd level comment done by the admin 7');

INSERT INTO comments (author, post, comment_ref, comment) VALUES (1, 10, 2, 'This is a 2nd level comment done by the admin 1');
INSERT INTO comments (author, post, comment_ref, comment) VALUES (1, 10, 2, 'This is a 2nd level comment done by the admin 2');
INSERT INTO comments (author, post, comment_ref, comment) VALUES (1, 10, 2, 'This is a 2nd level comment done by the admin 3');
INSERT INTO comments (author, post, comment_ref, comment) VALUES (1, 10, 2, 'This is a 2nd level comment done by the admin 4');
INSERT INTO comments (author, post, comment_ref, comment) VALUES (1, 10, 2, 'This is a 2nd level comment done by the admin 5');
INSERT INTO comments (author, post, comment_ref, comment) VALUES (1, 10, 2, 'This is a 2nd level comment done by the admin 6');
INSERT INTO comments (author, post, comment_ref, comment) VALUES (1, 10, 2, 'This is a 2nd level comment done by the admin 7');