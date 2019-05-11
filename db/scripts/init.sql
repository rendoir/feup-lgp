CREATE TYPE permission_level_enum AS ENUM (
    'admin',
    'user'
);

CREATE TYPE conf_permission_level_enum AS ENUM (
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
    'conference',
    'post'
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
    livestream_URL TEXT,
    local TEXT NOT NULL,
    dateStart TEXT NOT NULL ,
    dateEnd TEXT,
    avatar TEXT ARRAY,
    privacy visibility_enum NOT NULL DEFAULT 'public'
);

CREATE TABLE conf_users (
    id BIGINT REFERENCES users ON DELETE CASCADE,
    conference BIGINT REFERENCES conferences ON DELETE CASCADE,
    conf_permissions conf_permission_level_enum NOT NULL DEFAULT 'user'
);


CREATE TABLE posts (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    author BIGINT REFERENCES users ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    search_tokens TSVECTOR, -- full-text search
    conference BIGINT REFERENCES conferences ON DELETE CASCADE,
    content_image TEXT ARRAY,
    content_video TEXT ARRAY,
    content_document TEXT ARRAY,
    rate INTEGER NOT NULL DEFAULT 50 CONSTRAINT post_rate_constraint CHECK (rate >= 1 AND rate <= 100),
    visibility visibility_enum NOT NULL DEFAULT 'public',
    likes BIGINT DEFAULT 0,
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
    PRIMARY KEY(subscriber, post)
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

CREATE TABLE conference_participants (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    participant_user BIGINT REFERENCES users ON DELETE CASCADE,
    conference BIGINT REFERENCES conferences ON DELETE CASCADE,
    UNIQUE (participant_user, conference)
);

-- Invites are both for conferences and posts
CREATE TABLE invites (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    invited_user BIGINT REFERENCES users ON DELETE CASCADE,
    invite_subject_id BIGINT NOT NULL,
    invite_type invite_type_enum NOT NULL,
    user_notified BOOLEAN DEFAULT FALSE, -- set to true when the invited user sees the invite notification
    date_invited TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_invite UNIQUE (invited_user, invite_subject_id, invite_type)
);

ALTER TABLE IF EXISTS ONLY likes_a_comment
    ADD CONSTRAINT likes_a_comment_pkey PRIMARY KEY (comment, author);

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

/* If user expresses joins a conference, we can consider him as notified */
CREATE FUNCTION notified_on_attendance_intent() RETURNS trigger
    LANGUAGE plpgsql
AS $$BEGIN
    UPDATE invites 
        SET user_notified = TRUE 
        WHERE invited_user = NEW.participant_user 
            AND invite_subject_id = NEW.conference 
            AND invite_type = 'conference';
    RETURN NEW;
END$$;

CREATE TRIGGER notified_on_intent
    AFTER INSERT ON conference_participants
    FOR EACH ROW
EXECUTE PROCEDURE notified_on_attendance_intent();

/* User cannot enter a conference withou having permission */
CREATE OR REPLACE FUNCTION user_can_join_conference(_conference_id BIGINT, _user_id BIGINT)
RETURNS boolean AS $$
	SELECT EXISTS (
        SELECT *
        FROM conferences
        WHERE conferences.id = _conference_id AND
        (
            conferences.privacy = 'public' OR
            conferences.author = _user_id OR
            (conferences.privacy = 'followers' AND _user_id IN (SELECT follower FROM follows WHERE followed = conferences.author)) OR
            _user_id IN (SELECT invited_user
                    FROM invites
                    WHERE invited_user = _user_id AND
                    invite_subject_id = _conference_id AND
                    invite_type = 'conference'
                )
        )
    );
$$ LANGUAGE SQL;

CREATE FUNCTION join_conference_if_permitted() RETURNS trigger
    LANGUAGE plpgsql
AS $$BEGIN
    IF NOT user_can_join_conference(NEW.conference, NEW.participant_user) THEN
      RAISE EXCEPTION 'cannot join conference without permission'; 
   END IF;

   RETURN NEW;
END$$;

CREATE TRIGGER join_conference_on_permission
    BEFORE INSERT ON conference_participants
    FOR EACH ROW
EXECUTE PROCEDURE join_conference_if_permitted();

/* Utils functions fetching users according to their participance in conference/post */
-- CONFERENCES
CREATE OR REPLACE FUNCTION retrieve_conference_invited_or_joined_users(_conference_id BIGINT)
RETURNS TABLE(notified_user BIGINT) AS $$
	SELECT invited_user
        FROM invites
        WHERE invite_subject_id = _conference_id AND invite_type = 'conference'
    UNION
    SELECT participant_user
        FROM conference_participants
        WHERE conference = _conference_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION retrieve_conference_uninvited_subscribers(_conference_id BIGINT)
RETURNS TABLE(uninvited_subscriber BIGINT) AS $$
	SELECT follower
        FROM follows, conferences
        WHERE followed = author AND 
        conferences.id = _conference_id AND
        follower NOT IN (SELECT * FROM retrieve_conference_invited_or_joined_users(_conference_id));
$$ LANGUAGE SQL;
-- POSTS
CREATE OR REPLACE FUNCTION retrieve_post_invited_users(_post_id BIGINT)
RETURNS TABLE(invited_user BIGINT) AS $$
	SELECT invited_user
        FROM invites
        WHERE invite_subject_id = _post_id AND invite_type = 'post';
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION retrieve_post_uninvited_subscribers(_post_id BIGINT, _inviter_id BIGINT)
RETURNS TABLE(uninvited_subscriber BIGINT) AS $$
	SELECT DISTINCT follower
        FROM follows, posts
        WHERE followed = _inviter_id AND 
        follower NOT IN (SELECT * FROM retrieve_post_invited_users(_post_id));
$$ LANGUAGE SQL;


INSERT INTO users (email, pass, first_name, last_name, bio, home_town, university, work, work_field, permissions) VALUES ('adminooooo@gmail.com','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Admin', 'Admina', 'Sou medico, ola', 'Rio de Janeiro', 'FMUP', 'Hospital S. Joao', 'Cardiology', 'admin');
INSERT INTO users (email, pass, first_name, last_name, bio, university, work, permissions) VALUES ('user1@gmail.com','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'User', 'Doe','ICBAS', 'ICBAS', 'Surgeon', 'user');
INSERT INTO users (email, pass, first_name, last_name, bio, permissions) VALUES ('user2@gmail.com','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'John', 'User', 'FMUC', 'user');
INSERT INTO users (email, pass, first_name, last_name, bio, home_town, work_field, permissions) VALUES ('user3@gmail.com','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Michael', 'Meyers', 'ICBAS', 'Portalegre', 'Cardiology', 'user');


INSERT INTO follows (follower, followed) VALUES (1, 2);
INSERT INTO follows (follower, followed) VALUES (1, 3);
INSERT INTO follows (follower, followed) VALUES (2, 3);
INSERT INTO follows (follower, followed) VALUES (3, 4);

INSERT INTO users_rates (evaluator, rate, target_user) VALUES (4, 2, 2);
INSERT INTO users_rates (evaluator, rate, target_user) VALUES (2, 4, 3);
INSERT INTO users_rates (evaluator, rate, target_user) VALUES (4, 2, 3);
INSERT INTO users_rates (evaluator, rate, target_user) VALUES (2, 3, 4);
INSERT INTO users_rates (evaluator, rate, target_user) VALUES (3, 1, 4);

/**
* CONFERENCES
*/
INSERT INTO conferences(author, title, about, local, dateStart, dateEnd) VALUES (1, 'Admin conference 1', 'This conference was created by an admin', 'Porto', '2019-05-05 21:30', '2019-05-06 21:30');
INSERT INTO conferences(author, title, about, local, dateStart, dateEnd) VALUES (2, 'User conference 1', 'This conference was created by an user', 'Porto', '2019-05-05 21:30', '2019-05-06 21:30');
INSERT INTO conferences(author, title, about, local, dateStart, dateEnd) VALUES (3, 'User conference 2', 'This conference was created by an user', 'Porto', '2019-05-05 21:30', '2019-05-06 21:30');
INSERT INTO conferences(author, title, about, local, dateStart, dateEnd) VALUES (1, 'Admin conference 2', 'This conference was created by an admin', 'Porto', '2019-05-05 21:30', '2019-05-06 21:30');
INSERT INTO conferences(author, title, about, local, dateStart, dateEnd) VALUES (2, 'User conference 3', 'This conference was created by an user', 'Porto', '2019-05-05 21:30', '2019-05-06 21:30');
INSERT INTO conferences (author, title, about, local, dateStart, privacy) VALUES (4, 'conf 6', 'this is a public conference, any person can join', 'local', '2019-05-01 21:30', 'public');
INSERT INTO conferences (author, title, about, local, dateStart, privacy) VALUES (3, 'conference 7', 'this is a followers or invite only conference (visibility: followers)', 'local', '2019-05-01 21:30', 'followers');
INSERT INTO conferences (author, title, about, local, dateStart, privacy) VALUES (4, 'confer 8', 'this is an invite only conference (visibility: private)', 'local', '2019-05-01 21:30', 'private');


INSERT INTO conf_users (id, conference, conf_permissions) VALUES (1, 1, 'admin');
INSERT INTO conf_users (id, conference, conf_permissions) VALUES (2, 1, 'moderator');
INSERT INTO conf_users (id, conference, conf_permissions) VALUES (3, 1, 'user');
INSERT INTO conf_users (id, conference, conf_permissions) VALUES (1, 2, 'moderator');
INSERT INTO conf_users (id, conference, conf_permissions) VALUES (3, 2, 'admin');
INSERT INTO conf_users (id, conference, conf_permissions) VALUES (2, 2, 'user');
INSERT INTO conf_users (id, conference, conf_permissions) VALUES (2, 3, 'admin');
INSERT INTO conf_users (id, conference, conf_permissions) VALUES (1, 3, 'user');
INSERT INTO conf_users (id, conference, conf_permissions) VALUES (3, 3, 'moderator');

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

/* POSTS IN CONFERENCE */
INSERT INTO posts (author, title, content, conference, visibility, date_created) VALUES (2, 'User post', 'This post was created by an user and appears in a conference', 1, 'private', '2019-12-03');
INSERT INTO posts (author, title, content, conference, visibility, date_created) VALUES (3, 'User post', 'This post was created by an user and appears in a conference', 1, 'public', '2019-12-03');
INSERT INTO posts (author, title, content, conference, date_created) VALUES (1, 'Admin post', 'This post was created by an admin and appears in a conference', 1, '2019-12-02');
INSERT INTO posts (author, title, content, conference, visibility, date_created) VALUES (2, 'User post', 'This post was created by an user and appears in a conference', 2, 'followers', '2019-12-01');
INSERT INTO posts (author, title, content, conference) VALUES (1, 'Admin post', 'This is a post done by the admin and appears in a conference', 2);
INSERT INTO posts (author, title, content, conference) VALUES (2, 'User post', 'This is a post done by a mere user following the admin and appears in a conference', 1);


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
INSERT INTO tags (name) VALUES ('Conference Paper');
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

INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 3, 2);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 4, 3);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (2, 5, 1);
INSERT INTO posts_rates (evaluator, rate, post) VALUES (3, 2, 1);


/**
* INVITES
*/
INSERT INTO invites (invited_user, invite_subject_id, invite_type) VALUES (1, 6, 'post');
