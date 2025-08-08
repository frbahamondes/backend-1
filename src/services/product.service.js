const productDao = require('../dao/mongo/product.mongo');

// 🔄 Ahora acepta los filtros de paginación, orden y query
const getAllProducts = async ({ limit, page, sort, query }) => {
    return await productDao.getAll({ limit, page, sort, query });
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