export async function getProduct(req, res, conferenceId = null) {
    res.send(null);
}

// TODO: Check user permissions.
export async function createProduct(req, res, conferenceId = null) {
    const userId = req.user.id;
    res.send(null);
}

// TODO: Check user permissions.
export async function updateProduct(req, res, conferenceId = null) {
    const userId = req.user.id;
    res.send(null);
}

// TODO: Check user permissions.
export async function deleteProduct(req, res, conferenceId = null) {
    const userId = req.user.id;
    res.send(null);
}
