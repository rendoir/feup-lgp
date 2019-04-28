import * as crypto from 'crypto';
import {query} from '../db/db';

export function getAllTags(req, res) {
    query(`SELECT * FROM tags`).then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log(error);
        res.status(400).send({ message: `An error ocurred while gettting tags` });
    });
}