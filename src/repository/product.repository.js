class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = async (filters) => {
        return this.dao.getAll(filters);
    };

    getProductById = async (id) => {
        return this.dao.getById(id);
    };

    createProduct = async (product) => {
        return this.dao.create(product);
    };

    updateProduct = async (id, data) => {
        return this.dao.update(id, data);
    };

    deleteProduct = async (id) => {
        return this.dao.delete(id);
    };
}

module.exports = ProductRepository;
