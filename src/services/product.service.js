const ProductRepository = require('../repository/product.repository');
const productDao = require('../dao/mongo/product.mongo'); // ✅ Ya está instanciado en el export
const ProductDTO = require('../dto/product.dto');

const productRepository = new ProductRepository(productDao);

class ProductService {
    async getAllProducts({ limit, page, sort, query }) {
        return await productRepository.getProducts({ limit, page, sort, query });
    }

    async getProductById(id) {
        return await productRepository.getProductById(id);
    }

    async createProduct(productData) {
        const productDTO = new ProductDTO(productData);
        return await productRepository.createProduct(productDTO);
    }

    async updateProduct(id, updateData) {
        return await productRepository.updateProduct(id, updateData);
    }

    async deleteProduct(id) {
        return await productRepository.deleteProduct(id);
    }
}

// 👇 Esta línea es clave para importar la instancia del servicio
module.exports = new ProductService();