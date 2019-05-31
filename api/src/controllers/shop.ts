import { query } from '../db/db';
import { isAdmin } from './admin';

export async function getProducts(req, res) {
    const conferenceId = req.params.id;
    try {
        let result;
        if (conferenceId === undefined) {
            result = await query({
                text: `SELECT id, name, stock, points, date_created as date, image, conference
                        FROM products
                        WHERE
                            conference IS null
                        ORDER BY date DESC`,
            });
        } else {
            result = await query({
                text: `SELECT id, name, stock, points, date_created as date, image, conference
                        FROM products
                        WHERE
                            conference = $1
                        ORDER BY date DESC`,
                values: [conferenceId],
            });
        }
        res.send({
            products: result.rows,
        });
    } catch (error) /* istanbul ignore next */ {
        res.status(500).send({
            message: `Error retrieving products: ${error}`,
        });
    }
}

export async function getProduct(req, res) {
    const conferenceId = req.params.conf_id;
    try {
        const products = await query({
            text: `SELECT name, stock, points
                    FROM products
                    WHERE id = $1 AND conference = $2
                    `,
            values: [req.body.id, conferenceId],
        });
        res.send({ products: products.rows[0] });
    } catch (e) {
        console.log('Error getting products. Error: ' + e.message);
    }
}

export async function createProduct(req, res) {
    const conferenceId = req.params.conf_id;
    let imageURL = req.body.image;
    if (imageURL.length === 0) {
        imageURL = 'http://placehold.it/700x400';
    }
    if (conferenceId === undefined) {
        query({
            text: `INSERT INTO products (name, stock, points, image) VALUES ($1, $2, $3, $4)`,
            values: [req.body.name, req.body.stock, req.body.points, imageURL],
        }).then(() => {
            res.status(200).send();
        }).catch((error) => {
            console.log('\n\nERROR:', error);
            res.status(400).send({ message: 'An error ocurred while adding a new product' });
        });
    } else {
        query({
            text: `INSERT INTO products (name, stock, points, image, conference) VALUES ($1, $2, $3, $4, $5)`,
            values: [req.body.name, req.body.stock, req.body.points, req.body.image, conferenceId],
        }).then(() => {
            res.status(200).send();
        }).catch((error) => {
            console.log('\n\nERROR:', error);
            res.status(400).send({ message: 'An error ocurred while adding a new product' });
        });
    }
}

export async function updateProduct(req, res) {
    const productId = req.params.id;
    query({
        text: `UPDATE products SET name = $2, stock = $3, points = $4, image = $5
            WHERE id = $1`,
        values: [productId, req.body.name, req.body.stock, req.body.points, req.body.image],
    }).then(() => {
        res.status(200).send();
    }).catch(
        /* istanbul ignore next */
        (error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error occurred while editing a comment' });
    });
}

export async function deleteProduct(req, res) {
    const productId = req.params.id;
    query({
        text: `DELETE FROM products
                WHERE id = $1`,
        values: [productId],
    }).then((result) => {
        res.status(200).send();
    }).catch(
        /* istanbul ignore next */
        (error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while deleting a product' });
    });
}

export async function exchangeProduct(req, res) {
    const userId = req.user.id;
    const productId = req.params.id;
    query({
        text: `SELECT * FROM exchange_product($1, $2)`,
        values: [productId, userId],
    }).then((result) => {
        res.status(200).send();
    }).catch(
        /* istanbul ignore next */
        (error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while exchanging a product' });
    });
}
