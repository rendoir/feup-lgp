import * as shop from './shop';

export async function getProduct(req, res) {
    shop.getProduct(req, res);
}

export async function createProduct(req, res) {
    shop.createProduct(req, res);
}

export async function updateProduct(req, res) {
    shop.updateProduct(req, res);
}

export async function deleteProduct(req, res) {
    shop.deleteProduct(req, res);
}

export async function exchangeProduct(req, res) {
    shop.exchangeProduct(req, res);
}

export async function getProducts(req, res) {
    shop.getProducts(req, res);
}
