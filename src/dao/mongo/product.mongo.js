const ProductModel = require('../../models/product.model');

class ProductMongoDAO {
    // 📌 Obtener productos con paginación, orden y filtro por categoría
    async getAll({ limit = 10, page = 1, sort, query }) {
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            lean: true
        };

        const filter = query ? { category: query } : {};

        return await ProductModel.paginate(filter, options);
    }

    async getById(id) {
        return await ProductModel.findById(id);
    }

    async create(productData) {
        return await ProductModel.create(productData);
    }

    async update(id, updateData) {
        return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}

module.exports = new ProductMongoDAO();