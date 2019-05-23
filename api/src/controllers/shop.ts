import { query } from '../db/db';
import { isAdmin } from './admin';

export async function getProducts(req, res) {
    let conferenceId = req.params.conferenceId;
    const userId = req.user.id;
    try {
        let result;
        if (conferenceId === undefined) {
            result = await query({
                text: `SELECT name, stock, points, date_created as date, conference
                        FROM products
                        WHERE 
                            conference IS null
                        ORDER BY date DESC
                        LIMIT 2`,
            });
        } else {
            result = await query({
                text: `SELECT name, stock, points, date_created as date, conference
                        FROM products
                        WHERE 
                            conference = $1
                        ORDER BY date DESC
                        LIMIT 2`,
                values: [conferenceId],
            });
        }
        res.send({
            products: result.rows,
        });
    } catch (error) {
        res.status(500).send({
            message: `Error retrieving products: ${error}`,
        });
    }
}

export async function getProduct(req, res, conferenceId = null) {
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

export async function createProduct(req, res, conferenceId = null) {
    const userId = req.user.id;
    if(isAdmin(userId)){
        query({
            text: 'INSERT INTO products (name, stock, points, conference) VALUES ($1, $2, $3, $4)',
            values: [req.body.name, req.body.stock, req.body.points, conferenceId],
        }).then((result) => {
            res.status(200).send();
        }).catch((error) => {
            console.log('\n\nERROR:', error);
            res.status(400).send({ message: 'An error ocurred while adding a new product' });
        });
    }
}

export async function updateProduct(req, res, conferenceId = null) {
    const userId = req.user.id;
    if(isAdmin(userId)){
        query({
            text: `UPDATE products SET name = $2, stock = $3, points = $4
                WHERE id = $1`,
            values: [req.body.id, req.body.name, req.body.stock, req.body.points],
        }).then(() => {
            res.status(200).send();
        }).catch((error) => {
            console.log('\n\nERROR:', error);
            res.status(400).send({ message: 'An error occurred while editing a comment' });
        });
    }
}

export async function deleteProduct(req, res, conferenceId = null) {
    const userId = req.user.id;
    if(isAdmin(userId)){
        query({
            text: `DELETE FROM products
                    WHERE id = $1`,
            values: [req.body.id],
        }).then((result) => {
            res.status(200).send();
        }).catch((error) => {
            console.log('\n\nERROR:', error);
            res.status(400).send({ message: 'An error ocurred while deleting a product' });
        });
    }
}
