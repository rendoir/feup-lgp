import { query } from '../db/db';
import {editFiles, saveTags} from './post';

export async function getConference(req, res) {
    const id = req.params.id;
    const user = 2;
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
