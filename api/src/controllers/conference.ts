import { query } from '../db/db';

export function createConference(req, res) {
  if (!req.body.title.trim()) {
    console.log('\n\nError: Conference title cannot be empty');
    res.status(400).send({
      message: 'An error occurred while crating a new conference. ' +
        'The field title cannot be empty',
    });
    return;
  }
  if (!req.body.about.trim()) {
    console.log('\n\nError: Conference body cannot be empty');
    res.status(400).send({
      message: 'An error occurred while crating a new conference. ' +
        'The field about cannot be empty',
    });
  }
  if (!req.body.local.trim()) {
    console.log('\n\nError: Conference local cannot be empty');
    res.status(400).send({
      message: 'An error occurred while crating a new conference. ' +
        'The field local cannot be empty',
    });
  }
  if (!req.body.dateStart.trim()) {
    console.log('\n\nError: Conference starting date cannot be empty');
    res.status(400).send({
      message: 'An error occurred while crating a new conference. ' +
        'The field date start cannot be empty',
    });
  }
  if (req.body.dateEnd.trim()) {
    if (Date.parse(req.body.dateEnd) < Date.parse(req.body.dateStart)) {
      console.log(
        '\n\nError: Conference ending date cannot be previous to starting date',
      );
      res.status(400).send({
        message: 'An error occurred while crating a new conference. ' +
          'The field date end cannot be a date previous to date start',
      });
    }
  }

  query({
    text: 'INSERT INTO conferences (author, title, about, livestream_url, local, datestart, dateend, avatar, privacy) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
    values: [
      req.body.author,
      req.body.title,
      req.body.about,
      req.body.livestream,
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

export async function getConference(req, res) {
  const id = req.params.id;
  const user = 1; // logged in user
  try {
    /**
     * conference must be owned by user
     * OR conference is public
     * OR conference is private to followers and user is a follower of the author
     */
    const conference = await query({
      text: `
              SELECT c.id, a.id as user_id, a.first_name, a.last_name, c.title,
              c.about, c.livestream_url, c.local, c.dateStart, c.dateEnd, c.avatar, c.privacy
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
        new Error('Conference either does not exists or you do not have the required permissions'),
      );
      return;
    }
    const result = {
      conference: conference.rows[0],
    };
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(new Error('Error retrieving conference'));
  }
}

export async function archieveConference(req, res) {
  const id = req.params.id;
  const user = 1; // logged in user
  try {
    const archiveConference = await query({
      text: `
      INSERT INTO archived_conferences (author, title, about, livestream_url, local, datestart, dateend, avatar, privacy)
      SELECT c.author, c.title, c.about, c.livestream_url, c.local, c.datestart, c.dateend, c.avatar, c.privacy)
      FROM conferences c
      WHERE c.id=$1
			  `,
      values: [id, user],
    });
    const deleteConference = await query({
      text: `
      DELETE FROM conferences c
      WHERE c.id=$1;
			  `,
      values: [id, user],
    });
    if (archiveConference === null || deleteConference === null) {
      res.status(400).send(
        new Error('Error in the archieve process of conference'),
      );
      return;
    }
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send(new Error('Error archieve conference'));
  }
}
