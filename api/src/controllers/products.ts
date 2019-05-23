import * as shop from './shop';

export async function getProduct(req, res) {
    shop.getProduct(req, res);
}

// TODO: Check user permissions.
export async function createProduct(req, res) {
    shop.createProduct(req, res);
}

// TODO: Check user permissions.
export async function updateProduct(req, res) {
    shop.updateProduct(req, res);
}

// TODO: Check user permissions.
export async function deleteProduct(req, res) {
    shop.deleteProduct(req, res);
}
