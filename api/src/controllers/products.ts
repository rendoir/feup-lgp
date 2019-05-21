import { query } from '../db/db';

export async function getProduct(req, res) {
    res.send(null);
}

// TODO: Check user permissions.
export async function createProduct(req, res) {
    const userId = req.user.id;
    res.send(null);
}

// TODO: Check user permissions.
export async function updateProduct(req, res) {
    const userId = req.user.id;
    res.send(null);
}

// TODO: Check user permissions.
export async function deleteProduct(req, res) {
    const userId = req.user.id;
    res.send(null);
}
