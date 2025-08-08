const Product = require('../models/product.model'); // Modelo directo

const getAllProducts = async ({ limit, page, sort, query }) => {
    let filter = {};
    if (query) {
        filter.category = query;
    }

    let sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    if (sort === 'desc') sortOption.price = -1;

    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sortOption,
        lean: true,
    };

    const products = await Product.paginate(filter, options);

    return products;
};

module.exports = {
    getAllProducts,
};
