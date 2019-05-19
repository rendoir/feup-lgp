CREATE TYPE permission_level_enum AS ENUM (
    'admin',
    'user'
);

CREATE TYPE talk_permission_level_enum AS ENUM (
    'admin',
    'user',
    'moderator'
    );

CREATE TYPE visibility_enum AS ENUM (
    'public',
    'followers',
    'private',
    'closed'
);

CREATE TYPE content_type_enum AS ENUM (
    'comment',
    'post'
);

CREATE TYPE invite_type_enum AS ENUM (
    'talk',
    'post'
);

CREATE TYPE challenge_type_enum AS ENUM (
    'question_options',
    'livestream_view',
    'comment_post',
    'create_post',
    'answer_question'
);

CREATE TABLE users (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    bio TEXT,
    email TEXT UNIQUE,
    pass TEXT,
    rate FLOAT NOT NULL DEFAULT 50 CONSTRAINT user_rate_constraint CHECK (rate >= 1 AND rate <= 100),
    date_created TIMESTAMP DEFAULT NOW(),
    home_town TEXT,
    university TEXT,
    work TEXT,
    work_field TEXT,
    permissions permission_level_enum NOT NULL DEFAULT 'user'
);

CREATE TABLE follows (
    follower BIGINT REFERENCES users ON DELETE CASCADE,
    followed BIGINT REFERENCES users ON DELETE CASCADE,
    PRIMARY KEY(follower, followed)
);

CREATE TABLE users_rates (
    evaluator BIGINT REFERENCES users ON DELETE CASCADE,
    rate INTEGER NOT NULL CONSTRAINT user_user_rate_constraint CHECK (rate >= 1 AND rate <= 5),
    target_user BIGINT REFERENCES users ON DELETE CASCADE
);

CREATE TABLE conferences (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    author BIGINT REFERENCES users ON DELETE CASCADE,
    title TEXT NOT NULL,
    about TEXT NOT NULL,
    local TEXT NOT NULL,
    dateStart TEXT NOT NULL ,
    dateEnd TEXT,
    avatar TEXT,
    privacy visibility_enum NOT NULL DEFAULT 'public'
);

CREATE TABLE talks (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    author BIGINT REFERENCES users ON DELETE CASCADE,
    conference BIGINT REFERENCES conferences ON DELETE CASCADE,
    title TEXT NOT NULL,
    about TEXT NOT NULL,
    livestream_URL TEXT,
    local TEXT NOT NULL,
    dateStart TEXT NOT NULL ,
    dateEnd TEXT,
    avatar TEXT,
    privacy visibility_enum NOT NULL DEFAULT 'public',
	archived BOOLEAN DEFAULT FALSE
);

CREATE TABLE posts (
    id BIGINT UNIQUE GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    author BIGINT REFERENCES users ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    search_tokens TSVECTOR, -- full-text search
    talk BIGINT REFERENCES talks ON DELETE CASCADE,
    content_image TEXT ARRAY,
    content_video TEXT ARRAY,
    content_document TEXT ARRAY,
    rate INTEGER NOT NULL DEFAULT 50 CONSTRAINT post_rate_constraint CHECK (rate >= 1 AND rate <= 100),
    visibility visibility_enum NOT NULL DEFAULT 'public',
    date_created TIMESTAMP DEFAULT NOW(),
    date_updated TIMESTAMP
);

CREATE TABLE files (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    mimeType TEXT NOT NULL,
    size INTEGER NOT NULL,
    post BIGINT REFERENCES posts ON DELETE CASCADE,
    CONSTRAINT unique_post_file UNIQUE (name, post)
);

CREATE TABLE comments (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    author BIGINT REFERENCES users ON DELETE CASCADE,
    post BIGINT REFERENCES posts ON DELETE CASCADE,
    comment_ref BIGINT REFERENCES comments ON DELETE CASCADE,
    comment TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT NOW(),
    date_updated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE content_reports (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    reporter BIGINT REFERENCES users ON DELETE CASCADE,
    content_id BIGINT NOT NULL,
    content_type content_type_enum NOT NULL,
    description TEXT NOT NULL,
    admin_review BOOLEAN DEFAULT FALSE,
    date_reported TIMESTAMP DEFAULT NOW(),
    UNIQUE (reporter, content_id, content_type)
);

CREATE TABLE tags (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE posts_tags (
    post BIGINT REFERENCES posts ON DELETE CASCADE,
    tag BIGINT REFERENCES tags ON DELETE CASCADE,
    PRIMARY KEY(post, tag)
);

CREATE TABLE posts_subscriptions (
    subscriber BIGINT REFERENCES users ON DELETE CASCADE,
    post BIGINT REFERENCES posts ON DELETE CASCADE,
    CONSTRAINT pk_posts_subscriptions PRIMARY KEY(subscriber, post)
);

CREATE TABLE posts_rates (
    evaluator BIGINT REFERENCES users ON DELETE CASCADE,
    rate INTEGER NOT NULL CONSTRAINT user_post_rate_constraint CHECK (rate >= 1 AND rate <= 5),
    post BIGINT REFERENCES posts ON DELETE CASCADE
);

CREATE TABLE likes_a_comment (
    comment BIGINT REFERENCES comments ON DELETE CASCADE,
    author BIGINT REFERENCES users ON DELETE CASCADE
);

ALTER TABLE IF EXISTS ONLY likes_a_comment
    ADD CONSTRAINT likes_a_comment_pkey PRIMARY KEY (comment, author);

CREATE TABLE talk_participants (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    participant_user BIGINT REFERENCES users ON DELETE CASCADE,
    talk BIGINT REFERENCES talks ON DELETE CASCADE,
    points BIGINT DEFAULT 0,
    talk_permissions talk_permission_level_enum NOT NULL DEFAULT 'user',
    UNIQUE (participant_user, talk)
);

-- Invites are both for talks and posts
CREATE TABLE invites (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    invited_user BIGINT REFERENCES users ON DELETE CASCADE,
    invite_subject_id BIGINT NOT NULL,
    invite_type invite_type_enum NOT NULL,
    user_notified BOOLEAN DEFAULT FALSE, -- set to true when the invited user sees the invite notification
    date_invited TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_invite UNIQUE (invited_user, invite_subject_id, invite_type)
);

CREATE TABLE challenges (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    dateStart TEXT NOT NULL,
    dateEnd TEXT,
    prize TEXT,
    points_prize BIGINT DEFAULT 0,
    challengeType challenge_type_enum NOT NULL,
    content TEXT ARRAY NOT NULL,
    talk BIGINT REFERENCES talks ON DELETE CASCADE
);

CREATE TABLE user_challenge (
    challenged BIGINT REFERENCES users ON DELETE CASCADE,
    challenge BIGINT REFERENCES challenges ON DELETE CASCADE,
    answer TEXT,
    complete BOOLEAN DEFAULT FALSE,
    PRIMARY KEY(challenged, challenge)
);

CREATE FUNCTION update_points_user() RETURNS trigger
    LANGUAGE plpgsql
AS $$BEGIN
    IF NEW.complete IS TRUE THEN
        UPDATE talk_participants SET points = points + (SELECT points_prize FROM challenges WHERE id = NEW.challenge) WHERE participant_user = NEW.challenged;
    END IF;
    RETURN NEW;
END$$;

CREATE TRIGGER update_points_of_user
    AFTER INSERT OR UPDATE ON user_challenge
    FOR EACH ROW
EXECUTE PROCEDURE update_points_user();

/* If user expresses joins a conference, we can consider him as notified */
CREATE FUNCTION notified_on_attendance_intent() RETURNS trigger
    LANGUAGE plpgsql
AS $$BEGIN
    UPDATE invites 
        SET user_notified = TRUE 
        WHERE invited_user = NEW.participant_user 
            AND invite_subject_id = NEW.talk 
            AND invite_type = 'talk';
    RETURN NEW;
END$$;

CREATE TRIGGER notified_on_intent
    AFTER INSERT ON talk_participants
    FOR EACH ROW
EXECUTE PROCEDURE notified_on_attendance_intent();

/* User cannot enter a talk withou having permission */
CREATE OR REPLACE FUNCTION user_can_join_talk(_talk_id BIGINT, _user_id BIGINT)
RETURNS boolean AS $$
	SELECT EXISTS (
        SELECT *
        FROM talks
        WHERE talks.id = _talk_id AND
        (
            talks.privacy = 'public' OR
            talks.author = _user_id OR
            (talks.privacy = 'followers' AND _user_id IN (SELECT follower FROM follows WHERE followed = talks.author)) OR
            _user_id IN (SELECT invited_user
                    FROM invites
                    WHERE invited_user = _user_id AND
                    invite_subject_id = _talk_id AND
                    invite_type = 'talk'
                )
        )
    );
$$ LANGUAGE SQL;

CREATE FUNCTION join_talk_if_permitted() RETURNS trigger
    LANGUAGE plpgsql
AS $$BEGIN
    IF NOT user_can_join_talk(NEW.talk, NEW.participant_user) THEN
      RAISE EXCEPTION 'cannot join talk without permission'; 
   END IF;

   RETURN NEW;
END$$;

CREATE TRIGGER join_talk_on_permission
    BEFORE INSERT ON talk_participants
    FOR EACH ROW
EXECUTE PROCEDURE join_talk_if_permitted();

/* Utils functions fetching users according to their participance in talk/post */
-- talkS
CREATE OR REPLACE FUNCTION retrieve_talk_invited_or_joined_users(_talk_id BIGINT)
RETURNS TABLE(notified_user BIGINT) AS $$
	SELECT invited_user
        FROM invites
        WHERE invite_subject_id = _talk_id AND invite_type = 'talk'
    UNION
    SELECT participant_user
        FROM talk_participants
        WHERE talk = _talk_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION retrieve_talk_uninvited_subscribers(_talk_id BIGINT)
RETURNS TABLE(uninvited_subscriber BIGINT) AS $$
	SELECT follower
        FROM follows, talks
        WHERE followed = author AND 
        talks.id = _talk_id AND
        follower NOT IN (SELECT * FROM retrieve_talk_invited_or_joined_users(_talk_id));
$$ LANGUAGE SQL;
-- POSTS
CREATE OR REPLACE FUNCTION retrieve_post_invited_or_subscribed_users(_post_id BIGINT)
RETURNS TABLE(invited_user BIGINT) AS $$
	SELECT invited_user
        FROM invites
        WHERE invite_subject_id = _post_id AND invite_type = 'post'
    UNION
    SELECT subscriber
        FROM posts_subscriptions
        WHERE post = _post_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION retrieve_post_uninvited_subscribers(_post_id BIGINT, _inviter_id BIGINT)
RETURNS TABLE(uninvited_subscriber BIGINT) AS $$
	SELECT DISTINCT follower
        FROM follows
        WHERE followed = _inviter_id AND 
        follower NOT IN (SELECT * FROM retrieve_post_invited_or_subscribed_users(_post_id));
$$ LANGUAGE SQL;

/**
*
* INSERTS
*
*/

/**
* USERS
*/
-- Unhashed password: 'adminadmin'
INSERT INTO users (email, pass, first_name, last_name, bio, home_town, university, work, work_field, permissions) VALUES ('admin@gmail.com','d82494f05d6917ba02f7aaa29689ccb444bb73f20380876cb05d1f37537b7892', 'Admin', 'Admina', 'Sou medico, ola', 'Rio de Janeiro', 'FMUP', 'Hospital S. Joao', 'Cardiology', 'admin');
-- Following unhashed passwords: 'useruser'
INSERT INTO users (email, pass, first_name, last_name, bio, university, work, permissions) VALUES ('user1@gmail.com','e172c5654dbc12d78ce1850a4f7956ba6e5a3d2ac40f0925fc6d691ebb54f6bf', 'User', 'Doe','ICBAS', 'ICBAS', 'Surgeon', 'user');
INSERT INTO users (email, pass, first_name, last_name, bio, permissions) VALUES ('user2@gmail.com','e172c5654dbc12d78ce1850a4f7956ba6e5a3d2ac40f0925fc6d691ebb54f6bf', 'John', 'User', 'FMUC', 'user');
INSERT INTO users (email, pass, first_name, last_name, bio, home_town, work_field, permissions) VALUES ('user3@gmail.com','e172c5654dbc12d78ce1850a4f7956ba6e5a3d2ac40f0925fc6d691ebb54f6bf', 'Michael', 'Meyers', 'ICBAS', 'Portalegre', 'Cardiology', 'user');

/** 
* USERS FOLLOWING USERS
*/
INSERT INTO follows (follower, followed) VALUES (1, 2);
INSERT INTO follows (follower, followed) VALUES (1, 3);
INSERT INTO follows (follower, followed) VALUES (2, 3);
INSERT INTO follows (follower, followed) VALUES (3, 4);

/** 
* RATINGS OF USERS
*/
INSERT INTO users_rates (evaluator, rate, target_user) VALUES (4, 2, 2);
INSERT INTO users_rates (evaluator, rate, target_user) VALUES (2, 4, 3);
INSERT INTO users_rates (evaluator, rate, target_user) VALUES (4, 2, 3);
INSERT INTO users_rates (evaluator, rate, target_user) VALUES (2, 3, 4);
INSERT INTO users_rates (evaluator, rate, target_user) VALUES (3, 1, 4);

INSERT INTO conferences(author, title, about, local, dateStart, dateEnd, privacy) VALUES (1, 'Musical Conference', 'This conference was made for music lovers', 'Porto', '2019-05-05T21:30', '2019-05-06T21:30', 'public');
INSERT INTO conferences(author, title, about, local, dateStart, dateEnd, privacy) VALUES (1, 'Diverse Conference', 'This conference was made everything else', 'Porto', '2019-05-05T21:30', '2019-05-06T21:30', 'public');

INSERT INTO talks(author, conference, title, about, livestream_URL, local, dateStart, dateEnd, privacy, avatar) VALUES (1, 1, 'Chill Music', 'This talk was created by an admin that likes chill music', 'https://www.youtube.com/embed/hHW1oY26kxQ' , 'Porto', '2019-05-05T21:30', '2019-05-08T21:30', 'public', 'https://static1.squarespace.com/static/57e7d4db44024351976cbf08/t/5b0714d12b6a28312911c518/1527190744736/music-200x200.png?format=300w');
INSERT INTO talks(author, conference, title, about, livestream_URL, local, dateStart, dateEnd, privacy, avatar) VALUES (2, 1, 'Nasa Talk', 'This talk was created by a user that likes Nasa', 'https://www.youtube.com/embed/4993sBLAzGA' , 'Porto', '2019-05-06T21:30', '2019-05-10T21:30', 'public', 'http://lofrev.net/wp-content/photos/2014/09/Nasa-icon-e1410677250198.jpg');
INSERT INTO talks(author, conference, title, about, livestream_URL, local, dateStart, dateEnd, privacy) VALUES (3, 2, 'User talk 2', 'This talk was created by n user', 'https://www.youtube.com/embed/PPPLiCWllv8' , 'Porto', '2019-05-05T21:30', '2019-05-06T21:30', 'public');
INSERT INTO talks(author, conference, title, about, livestream_URL, local, dateStart, dateEnd, privacy) VALUES (1, 2, 'Admin talk 2', 'This talk was created by an admin', 'https://www.youtube.com/embed/PPPLiCWllv8' , 'Porto', '2019-05-05T21:30', '2019-05-06T21:30', 'public');
INSERT INTO talks(author, conference, title, about, livestream_URL, local, dateStart, dateEnd, privacy) VALUES (2, 2, 'User talk 3', 'This talk was created by a user', 'https://www.youtube.com/embed/PPPLiCWllv8' , 'Porto', '2019-05-05T21:30', '2019-05-06T21:30', 'public');
INSERT INTO talks(author, conference, title, about, livestream_URL, local, dateStart, dateEnd, privacy) VALUES (4, 2, 'Titulo', 'This is a public talk, any person can join', 'https://www.youtube.com/embed/PPPLiCWllv8' , 'Porto', '2019-05-05T21:30', '2019-05-06T21:30', 'public');
INSERT INTO talks(author, conference, title, about, livestream_URL, local, dateStart, dateEnd, privacy) VALUES (3, 2, 'Titulo 2', 'This is a followers or invite only talk (visibility: followers)', 'https://www.youtube.com/embed/PPPLiCWllv8' , 'Porto', '2019-05-05T21:30', '2019-05-06T21:30', 'followers');
INSERT INTO talks(author, conference, title, about, livestream_URL, local, dateStart, dateEnd, privacy) VALUES (4, 2, 'Titulo 3', 'This is an invite only talk (visibility: private)', 'https://www.youtube.com/embed/PPPLiCWllv8' , 'Porto', '2019-05-05T21:30', '2019-05-06T21:30', 'private');

INSERT INTO talk_participants (participant_user, talk, talk_permissions) VALUES (1, 1, 'admin');
INSERT INTO talk_participants (participant_user, talk, talk_permissions) VALUES (2, 1, 'moderator');
INSERT INTO talk_participants (participant_user, talk, talk_permissions) VALUES (3, 1, 'user');
INSERT INTO talk_participants (participant_user, talk, talk_permissions) VALUES (1, 2, 'moderator');
INSERT INTO talk_participants (participant_user, talk, talk_permissions) VALUES (3, 2, 'admin');
INSERT INTO talk_participants (participant_user, talk, talk_permissions) VALUES (2, 2, 'user');
INSERT INTO talk_participants (participant_user, talk, talk_permissions) VALUES (2, 3, 'admin');
INSERT INTO talk_participants (participant_user, talk, talk_permissions) VALUES (1, 3, 'user');
INSERT INTO talk_participants (participant_user, talk, talk_permissions) VALUES (3, 3, 'moderator');

INSERT INTO posts (author, title, content, visibility, date_created) VALUES (2, 'User post', 'This post should NOT be visible', 'private', '2018-12-03');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (3, 'User post', 'This is a post done by a mere user 3', 'public', '2018-12-03');
INSERT INTO posts (author, title, content, date_created) VALUES (1, 'Admin post', 'This is a post done by the admin', '2018-12-02');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (2, 'User post', 'This is a post done by a mere user following the admin', 'followers', '2018-12-01');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (1, 'Admin post', 'This is a post done by the admin', 'public', '2018-12-23');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (2, 'User post', 'This is a post done by a mere user following the admin', 'public', '2018-12-21');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (1, 'Admin post', 'This is a post done by the admin', 'public', '2018-12-05');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (2, 'User post', 'This is a post done by a mere user following the admin', 'public', '2018-12-15');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (1, 'Admin post', 'This is a post done by the admin', 'followers', '2018-12-09');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (2, 'User post', 'This is a post done by a mere user following the admin', 'public', '2018-12-10');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (1, 'Admin post', 'This is a post done by the admin', 'followers', '2018-12-14');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (2, 'User post', 'This is a post done by a mere user following the admin', 'public', '2018-12-13');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (1, 'Admin post', 'This is a post done by the admin', 'public', '2018-12-07');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (2, 'User post', 'This is a post done by a mere user following the admin', 'public', '2018-12-27');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (1, 'Admin post', 'This is a post done by the admin', 'followers', '2018-12-30');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (2, 'User post', 'This is a post done by a mere user following the admin', 'public', '2018-12-06');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (1, 'Admin post', 'This is a post done by the admin', 'public', '2018-12-09');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (2, 'User post', 'This is a post done by a mere user following the admin', 'public', '2018-12-16');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (1, 'Admin post', 'This is a post done by the admin', 'followers', '2018-12-27');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (2, 'User post', 'This is a post done by a mere user following the admin', 'public', '2018-12-18');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (1, 'Admin post', 'This is a post done by the admin', 'followers', '2018-12-02');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (2, 'User post', 'This is a post done by a mere user following the admin', 'public', '2018-12-22');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (1, 'Admin post', 'This is a post done by the admin', 'followers', '2018-12-12');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (2, 'User post', 'This is a post done by a mere user following the admin', 'public', '2018-12-20');
INSERT INTO posts (author, title, content, visibility, date_created) VALUES (3, 'User post', 'This is a post done by a mere user', 'public', '2018-12-23');

/* POSTS IN talk */
INSERT INTO posts (author, title, content, talk, visibility, date_created) VALUES (2, 'User post', 'This post was created by an user and appears in a talk', 1, 'private', '2018-12-03');
INSERT INTO posts (author, title, content, talk, visibility, date_created) VALUES (3, 'User post', 'This post was created by an user and appears in a talk', 1, 'public', '2018-12-03');
INSERT INTO posts (author, title, content, talk, date_created) VALUES (1, 'Admin post', 'This post was created by an admin and appears in a talk', 1, '2018-12-02');
INSERT INTO posts (author, title, content, talk, visibility, date_created) VALUES (2, 'User post', 'This post was created by an user and appears in a talk', 2, 'followers', '2018-12-01');
INSERT INTO posts (author, title, content, talk) VALUES (1, 'Admin post', 'This is a post done by the admin and appears in a talk', 2);
INSERT INTO posts (author, title, content, talk) VALUES (2, 'User post', 'This is a post done by a mere user following the admin and appears in a talk', 1);

-- Initialize full-text search for posts
UPDATE posts SET search_tokens = to_tsvector(title || ' ' || content);

INSERT INTO content_reports (reporter, content_id, content_type, description) VALUES (1, 2, 'post', 'Insulted my son');
INSERT INTO content_reports (reporter, content_id, content_type, description) VALUES (1, 3, 'post', 'Chauvinist content');

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

INSERT INTO content_reports (reporter, content_id, content_type, description) VALUES (1, 2, 'comment', 'Insults my family');
INSERT INTO content_reports (reporter, content_id, content_type, description) VALUES (1, 3, 'comment', 'Says hitler did nothing wrong');
INSERT INTO content_reports (reporter, content_id, content_type, description) VALUES (1, 12, 'comment', 'Insults my dog');
INSERT INTO content_reports (reporter, content_id, content_type, description) VALUES (1, 13, 'comment', 'Insults my mom');

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

/**
* tags related to content
**/
INSERT INTO tags (name) VALUES ('Question');
INSERT INTO tags (name) VALUES ('Article');
INSERT INTO tags (name) VALUES ('Research Paper');
INSERT INTO tags (name) VALUES ('talk Paper');
INSERT INTO tags (name) VALUES ('Presentation');
INSERT INTO tags (name) VALUES ('Poster');
INSERT INTO tags (name) VALUES ('Book');
INSERT INTO tags (name) VALUES ('Project');
INSERT INTO tags (name) VALUES ('Images');
INSERT INTO tags (name) VALUES ('Videos');

INSERT INTO tags (name) VALUES ('New preprint');
INSERT INTO tags (name) VALUES ('Chapter');

INSERT INTO tags (name) VALUES ('File Available');
INSERT INTO tags (name) VALUES ('Full-text available');

/**
* tags related to medical specialities
**/
INSERT INTO tags (name) VALUES ('Abdominal Radiology');
INSERT INTO tags (name) VALUES ('Addiction Psychiatry');
INSERT INTO tags (name) VALUES ('Adolescent Medicine');
INSERT INTO tags (name) VALUES ('Abdominal Radiology');
INSERT INTO tags (name) VALUES ('Adult Cardiothoracic Anesthesiology');
INSERT INTO tags (name) VALUES ('Adult Reconstructive Orthopaedics');
INSERT INTO tags (name) VALUES ('Advanced Heart Failure & Transplant Cardiology');
INSERT INTO tags (name) VALUES ('Allergy & Immunology');
INSERT INTO tags (name) VALUES ('Anesthesiology');

INSERT INTO tags (name) VALUES ('Biochemical Genetics');
INSERT INTO tags (name) VALUES ('Blood Banking - Transfusion Medicine');

INSERT INTO tags (name) VALUES ('Cardiothoracic Radiology');
INSERT INTO tags (name) VALUES ('Cardiovascular Disease');
INSERT INTO tags (name) VALUES ('Chemical Pathology');
INSERT INTO tags (name) VALUES ('Child & Adolescent Psychiatry');
INSERT INTO tags (name) VALUES ('Child Abuse Pediatrics');
INSERT INTO tags (name) VALUES ('Child Neurology');
INSERT INTO tags (name) VALUES ('Clinical & Laboratory Immunology');
INSERT INTO tags (name) VALUES ('Clinical Cardiac Electrophysiology');
INSERT INTO tags (name) VALUES ('Clinical Neurophysiology');
INSERT INTO tags (name) VALUES ('Colon & Rectal Surgery');
INSERT INTO tags (name) VALUES ('Congenital Cardiac Surgery');
INSERT INTO tags (name) VALUES ('Craniofacial Surgery');
INSERT INTO tags (name) VALUES ('Critical Care Medicine');
INSERT INTO tags (name) VALUES ('Critical Care Medicine');
INSERT INTO tags (name) VALUES ('Cytopathology');

INSERT INTO tags (name) VALUES ('Dermatology');
INSERT INTO tags (name) VALUES ('Dermatopathology');
INSERT INTO tags (name) VALUES ('Developmental-Behavioral Pediatrics');

INSERT INTO tags (name) VALUES ('Emergency Medicine');
INSERT INTO tags (name) VALUES ('Endocrinology, Diabetes & Metabolism');
INSERT INTO tags (name) VALUES ('Endovascular Surgical Neuroradiology');
INSERT INTO tags (name) VALUES ('Endovascular Surgical Neuroradiology');
INSERT INTO tags (name) VALUES ('Endovascular Surgical Neuroradiology');

INSERT INTO tags (name) VALUES ('Family Medicine');
INSERT INTO tags (name) VALUES ('Family Practice');
INSERT INTO tags (name) VALUES ('Female Pelvic Medicine & Reconstructive Surgery');
INSERT INTO tags (name) VALUES ('Foot & Ankle Orthopaedics');
INSERT INTO tags (name) VALUES ('Forensic Pathology');
INSERT INTO tags (name) VALUES ('Forensic Psychiatry');

INSERT INTO tags (name) VALUES ('Gastroenterology');
INSERT INTO tags (name) VALUES ('Geriatric Medicine');
INSERT INTO tags (name) VALUES ('Geriatric Psychiatry');

INSERT INTO tags (name) VALUES ('Hand Surgery');
INSERT INTO tags (name) VALUES ('Hematology');
INSERT INTO tags (name) VALUES ('Hematology & Oncology');

INSERT INTO tags (name) VALUES ('Infectious Disease');
INSERT INTO tags (name) VALUES ('Internal Medicine');
INSERT INTO tags (name) VALUES ('Internal Medicine-Pediatrics');
INSERT INTO tags (name) VALUES ('Interventional Cardiology');

INSERT INTO tags (name) VALUES ('Medical Genetics');
INSERT INTO tags (name) VALUES ('Medical Microbiology'); 
INSERT INTO tags (name) VALUES ('Medical Toxicology');
INSERT INTO tags (name) VALUES ('Molecular Genetic Pathology');
INSERT INTO tags (name) VALUES ('Muscoskeletal Radiology');
INSERT INTO tags (name) VALUES ('Musculoskeletal Oncology');

INSERT INTO tags (name) VALUES ('Neonatal-Perinatal Medicine');
INSERT INTO tags (name) VALUES ('Nephrology');
INSERT INTO tags (name) VALUES ('Neurological Surgery');
INSERT INTO tags (name) VALUES ('Neurology');
INSERT INTO tags (name) VALUES ('Neuromuscular Medicine');
INSERT INTO tags (name) VALUES ('Neuropathology');
INSERT INTO tags (name) VALUES ('Neuroradiology');
INSERT INTO tags (name) VALUES ('Nuclear Medicine');
INSERT INTO tags (name) VALUES ('Nuclear Radiology');

INSERT INTO tags (name) VALUES ('Obstetric Anesthesiology');
INSERT INTO tags (name) VALUES ('Obstetrics & Gynecology');
INSERT INTO tags (name) VALUES ('Oncology');
INSERT INTO tags (name) VALUES ('Ophthalmic Plastic & Reconstructive Surgery');
INSERT INTO tags (name) VALUES ('Ophthalmology');
INSERT INTO tags (name) VALUES ('Orthopaedic Sports Medicine');
INSERT INTO tags (name) VALUES ('Orthopaedic Surgery');
INSERT INTO tags (name) VALUES ('Orthopaedic Surgery of the Spine');
INSERT INTO tags (name) VALUES ('Orthopaedic Trauma');
INSERT INTO tags (name) VALUES ('Otolaryngology');
INSERT INTO tags (name) VALUES ('Otology - Neurotology');

INSERT INTO tags (name) VALUES ('Pain Medicine');
INSERT INTO tags (name) VALUES ('Pathology-Anatomic & Clinical');
INSERT INTO tags (name) VALUES ('Pediatric Anesthesiology');
INSERT INTO tags (name) VALUES ('Pediatric Cardiology');
INSERT INTO tags (name) VALUES ('Pediatric Critical Care Medicine');
INSERT INTO tags (name) VALUES ('Pediatric Emergency Medicine');
INSERT INTO tags (name) VALUES ('Pediatric Endocrinology');
INSERT INTO tags (name) VALUES ('Pediatric Gastroenterology');
INSERT INTO tags (name) VALUES ('Pediatric Hematology-Oncology');
INSERT INTO tags (name) VALUES ('Pediatric Infectious Diseases');
INSERT INTO tags (name) VALUES ('Pediatric Nephrology');
INSERT INTO tags (name) VALUES ('Pediatric Orthopaedics');
INSERT INTO tags (name) VALUES ('Pediatric Otolaryngology');
INSERT INTO tags (name) VALUES ('Pediatric Pathology');
INSERT INTO tags (name) VALUES ('Pediatric Pulmonology');
INSERT INTO tags (name) VALUES ('Pediatric Radiology');
INSERT INTO tags (name) VALUES ('Pediatric Rheumatology');
INSERT INTO tags (name) VALUES ('Pediatric Sports Medicine');
INSERT INTO tags (name) VALUES ('Pediatric Surgery');
INSERT INTO tags (name) VALUES ('Pediatric Transplant Hepatology');
INSERT INTO tags (name) VALUES ('Pediatric Urology');
INSERT INTO tags (name) VALUES ('Pediatrics');
INSERT INTO tags (name) VALUES ('Physical Medicine & Rehabilitation');
INSERT INTO tags (name) VALUES ('Plastic Surgery');
INSERT INTO tags (name) VALUES ('Preventive Medicine');
INSERT INTO tags (name) VALUES ('Procedural Dermatology');
INSERT INTO tags (name) VALUES ('Psychiatry');
INSERT INTO tags (name) VALUES ('Pulmonary Disease');
INSERT INTO tags (name) VALUES ('Pulmonary Disease & Critical Care Medicine');

INSERT INTO tags (name) VALUES ('Radiation Oncology');
INSERT INTO tags (name) VALUES ('Radiology-Diagnostic');
INSERT INTO tags (name) VALUES ('Rheumatology');

INSERT INTO tags (name) VALUES ('Sleep Medicine');
INSERT INTO tags (name) VALUES ('Spinal Cord Injury Medicine');
INSERT INTO tags (name) VALUES ('Sports Medicine');
INSERT INTO tags (name) VALUES ('Surgery-General');
INSERT INTO tags (name) VALUES ('Surgical Critical Care');

INSERT INTO tags (name) VALUES ('Thoracic Surgery');
INSERT INTO tags (name) VALUES ('Thoracic Surgery-Integrated');
INSERT INTO tags (name) VALUES ('Transplant Hepatology');

INSERT INTO tags (name) VALUES ('Urology');

INSERT INTO tags (name) VALUES ('Vascular & Interventional Radiology');
INSERT INTO tags (name) VALUES ('Vascular Surgery');


/**
* POST - TAGS
*/
INSERT INTO posts_tags (post,tag) VALUES (3,10);
INSERT INTO posts_tags (post,tag) VALUES (3,12);
INSERT INTO posts_tags (post,tag) VALUES (3,15);
INSERT INTO posts_tags (post,tag) VALUES (3,20);
INSERT INTO posts_tags (post,tag) VALUES (4,22);
INSERT INTO posts_tags (post,tag) VALUES (4,25);
INSERT INTO posts_tags (post,tag) VALUES (13,26);
INSERT INTO posts_tags (post,tag) VALUES (13,28);
INSERT INTO posts_tags (post,tag) VALUES (13,29);
INSERT INTO posts_tags (post,tag) VALUES (3,30);
INSERT INTO posts_tags (post,tag) VALUES (3,32);


/**
* POST - Subscriptions/Rates
*/
INSERT INTO posts_subscriptions (subscriber, post) VALUES (1, 1);
INSERT INTO posts_subscriptions (subscriber, post) VALUES (1, 2);

INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 3, 1);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 1, 1);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 5, 1);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 2, 1);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 3, 2);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 1, 2);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 5, 2);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 2, 2);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 3, 3);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 4, 3);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 5, 4);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 2, 4);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 3, 5);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 4, 6);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 5, 6);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 2, 6);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 5, 7);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 2, 7);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 3, 8);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 4, 8);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 5, 9);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 2, 9);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 3, 10);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 4, 20);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 5, 21);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 2, 21);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 3, 22);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 4, 23);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 5, 23);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 2, 23);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 5, 23);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 1, 24);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 3, 24);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 4, 24);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 5, 24);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 2, 24);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 3, 24);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 4, 13);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 5, 13);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 2, 14);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 3, 16);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 4, 17);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 1, 17);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 2, 19);

/**
* INVITES
*/
INSERT INTO invites (invited_user, invite_subject_id, invite_type) VALUES (1, 6, 'post');


/**
* CHALLENGES
*/
INSERT INTO challenges (title, dateStart, dateEnd, prize, points_prize, challengeType, content, talk) VALUES ('Challenge Options 1','2019-05-05 23:00','2019-05-05 23:59','points',10,'question_options','{"Question: What is the title of this conference","CorrectAnswer: User talk 2", "Answer: Admin conference 1","Answer: User conference 2","Answer: Admin conference 3", "Answer: Admin conference 4"}',3);
INSERT INTO challenges (title, dateStart, dateEnd, prize, points_prize, challengeType, content, talk) VALUES ('Challenge Question 1','2019-05-05 23:00','2019-05-05 23:59','points',10,'answer_question','{"Question: What is the title of this conference","CorrectAnswer: User talk 2"}',3);
INSERT INTO challenges (title, dateStart, dateEnd, prize, points_prize, challengeType, content, talk) VALUES ('Challenge Comment Post 1','2019-05-05 23:00','2019-05-05 23:59','points',10,'comment_post','{"PostToComment: 25"}',3);
INSERT INTO challenges (title, dateStart, dateEnd, prize, points_prize, challengeType, content, talk) VALUES ('Challenge Create Post 1','2019-05-05 23:00','2019-05-05 23:59','points',10,'create_post','{"Description: Create a Post in this talk where you explain why it is so important for you!"}',3);

