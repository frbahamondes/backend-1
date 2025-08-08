const productDao = require('../dao/mongo/product.mongo');

const getAllProducts = async () => {
    return await productDao.getAll();
};

const getProductById = async (id) => {
    return await productDao.getById(id);
};

const createProduct = async (productData) => {
    return await productDao.create(productData);
};

const updateProduct = async (id, updateData) => {
    return await productDao.update(id, updateData);
};

const deleteProduct = async (id) => {
    return await productDao.delete(id);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};