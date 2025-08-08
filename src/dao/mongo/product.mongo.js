const ProductModel = require('../../models/product.model');

class ProductMongoDAO {
    async getAll() {
        return await ProductModel.find();
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