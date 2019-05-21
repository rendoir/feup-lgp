import { query } from '../db/db';

export function createConference(req, res) {
  if (!req.body.title.trim()) {
    console.log('\n\nError: conference title cannot be empty');
    res.status(400).send({
      message: 'An error occurred while creating a new conference. ' +
        'The field title cannot be empty',
    });
    return;
  }
  if (!req.body.about.trim()) {
    console.log('\n\nError: conference body cannot be empty');
    res.status(400).send({
      message: 'An error occurred while creating a new conference. ' +
        'The field about cannot be empty',
    });
  }
  if (!req.body.local.trim()) {
    console.log('\n\nError: conference local cannot be empty');
    res.status(400).send({
      message: 'An error occurred while creating a new conference. ' +
        'The field local cannot be empty',
    });
  }
  if (!req.body.dateStart.trim()) {
    console.log('\n\nError: conference starting date cannot be empty');
    res.status(400).send({
      message: 'An error occurred while creating a new conference. ' +
        'The field date start cannot be empty',
    });
  }
  if (req.body.dateEnd.trim()) {
    if (Date.parse(req.body.dateEnd) < Date.parse(req.body.dateStart)) {
      console.log(
        '\n\nError: conference ending date cannot be previous to starting date',
      );
      res.status(400).send({
        message: 'An error occurred while creating a new conference. ' +
          'The field date end cannot be a date previous to date start',
      });
    }
  }
  const userId = req.user.id;
  query({
    text: 'INSERT INTO conferences (author, title, about, local, datestart, dateend, avatar, privacy) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
    values: [
      userId,
      req.body.title,
      req.body.about,
      req.body.local,
      req.body.dateStart,
      req.body.dateEnd,
      req.body.avatar,
      req.body.privacy,
    ],
  }).then((result) => {
    res.send({
      id: result.rows[0].id,
    });
  }).catch((error) => {
    console.log('\n\nERROR: ', error);
    res.status(400).send({
      message: 'An error occurred while crating a new conference. Error: ' + error.toString(),
    });
  });
}

export function editConference(req, res) {
  const data = req.body;
  const id = req.params.id;

  if (!data.title.trim()) {
    console.log('\n\nError: conference title cannot be empty');
    res.status(400).send({
      message: 'An error occurred while updating the conference. ' +
        'The field title cannot be empty',
    });
    return;
  }
  if (!data.about.trim()) {
    console.log('\n\nError: conference body cannot be empty');
    res.status(400).send({
      message: 'An error occurred while updating the conference. ' +
        'The field about cannot be empty',
    });
    return;
  }
  if (!data.local.trim()) {
    console.log('\n\nError: conference local cannot be empty');
    res.status(400).send({
      message: 'An error occurred while updating the conference. ' +
        'The field local cannot be empty',
    });
    return;
  }
  if (!data.dateStart.trim()) {
    console.log('\n\nError: conference starting date cannot be empty');
    res.status(400).send({
      message: 'An error occurred while updating the conference. ' +
        'The field date start cannot be empty',
    });
    return;
  }
  if (data.dateEnd.trim()) {
    if (Date.parse(data.dateEnd) < Date.parse(data.dateStart)) {
      console.log(
        '\n\nError: conference ending date cannot be previous to starting date',
      );
      res.status(400).send({
        message: 'An error occurred while updating the conference. ' +
          'The field date end cannot be a date previous to date start',
      });
      return;
    }
  }
  query({
    text: 'UPDATE conferences ' +
      'SET (title, about, local, datestart, dateend) = ($2, $3, $4, $5, $6) ' +
      'WHERE id = $1 ' +
      'RETURNING id',
    values: [
      id,
      data.title,
      data.about,
      data.local,
      data.dateStart,
      data.dateEnd,
    ],
  }).then((response) => {
    res.send({
      id: response.rows[0].id,
    });
  }).catch((error) => {
    console.log('ERROR: ', error);
    res.status(400).send({
      message: 'An error occurred while updating the conference. Error: ' + error.toString(),
    });
  });
}

export async function getConference(req, res) {
  const id = req.params.id;
  const user = req.query.user;
  try {
    /**
     * talk must be owned by user
     * OR talk is public
     * OR talk is private to followers and user is a follower of the author
     */
    const conference = await query({
      text: `
                SELECT c.id, a.id as user_id, a.first_name, a.last_name, c.title,
                c.about, c.local, c.dateStart, c.dateEnd, c.avatar, c.privacy
                FROM conferences c
                INNER JOIN users a ON c.author = a.id
                WHERE c.id = $1
                  AND (c.author = $2
                      OR c.privacy = 'public'
                      OR (c.privacy = 'followers'
                          AND c.author IN (SELECT followed FROM follows WHERE follower = $2)
                      )
                  )
              `,
      values: [id, user],
    });
    if (conference === null) {
      res.status(400).send(
        new Error('Talk either does not exists or you do not have the required permissions'),
      );
      return;
    }
    const talksResult = await query({
      text: `SELECT users.id AS user_id,
                    t.id,
                    t.author,
                    t.avatar,
                    t.privacy,
                    t.title,
                    t.about,
                    t.local,
                    t.dateStart,
                    t.dateEnd
            FROM talks t
                    INNER JOIN users ON (users.id = t.author)
            WHERE t.conference = $1
            ORDER BY t.dateEnd
            LIMIT 10 `,
      values: [id],
    });

    if (talksResult == null) {
      res.status(400).send(new Error(`Conference either does not exist or you do not have the required permissions.`));
      return;
    }

    const result = {
      conference: conference.rows[0],
      talks: talksResult.rows,

    };
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(new Error('Error retrieving Conference'));
  }
}

export async function getAllConferences(req, res) {
  const user = req.query.user;
  try {
    const conferences = await query({
      text: `
              SELECT c.*, u.id as userid, (u.first_name || ' ' || u.last_name) as username
              FROM conferences c
              INNER JOIN users u ON c.author = u.id
              WHERE
                c.author = $1
                OR c.privacy = 'public'
                OR (
                  c.privacy = 'followers'
                  AND c.author IN (
                    SELECT followed FROM follows WHERE follower = $1
                  )
                )
              ORDER BY c.dateend
            `,
      values: [user],
    });
    res.send({
      conferences: conferences.rows,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(new Error('Error retrieving Conferences'));
  }
}
