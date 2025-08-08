const Product = require('../models/product.model');
const productService = require('../services/product.service'); // 🔸 Importamos el servicio

// 📌 Obtener todos los productos con filtros, paginación, ordenamiento
const getAllProducts = async (req, res) => {
    try {
        console.log('GET /api/products fue llamado');
        const { limit = 10, page = 1, sort, query } = req.query;

        const products = await productService.getAllProducts({ limit, page, sort, query });

        const queryParams = new URLSearchParams({ limit, sort, query }).toString();
        const prevLink = products.hasPrevPage ? `/api/products?page=${products.prevPage}&${queryParams}` : null;
        const nextLink = products.hasNextPage ? `/api/products?page=${products.nextPage}&${queryParams}` : null;

        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        res.status(500).json({ error: '❌ Error al obtener los productos', message: error.message });
    }
};

// 📌 Obtener detalle de un producto
const getProductById = async (req, res) => {
    try {
        console.log(`GET /products/${req.params.pid} fue llamado`);
        const product = await Product.findById(req.params.pid).lean();

        if (!product) return res.status(404).send("❌ Producto no encontrado");

        res.render('productDetail', { product });
    } catch (error) {
        console.error('❌ Error al obtener el producto:', error);
        res.status(500).send('❌ Error al cargar el producto');
    }
};

// 📌 Crear un nuevo producto
const createProduct = async (req, res) => {
    try {
        console.log('POST /api/products fue llamado');
        const { title, description, price, code, category, stock, status, thumbnails } = req.body;

        if (!title || !price || !code || !category || stock === undefined) {
            return res.status(400).json({ error: '❌ Faltan campos obligatorios (title, price, code, category, stock)' });
        }

        const newProduct = new Product({
            title,
            description,
            price,
            code,
            category,
            stock,
            status: status !== undefined ? status : true,
            thumbnails
        });

        await newProduct.save();
        res.status(201).json({ message: '✅ Producto agregado con éxito', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: '❌ Error al agregar el producto', message: error.message });
    }
};

// 📌 Actualizar un producto
const updateProduct = async (req, res) => {
    try {
        console.log(`PUT /api/products/${req.params.pid} fue llamado`);
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: '❌ Producto no encontrado' });
        }
        res.json({ message: '✅ Producto actualizado', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: '❌ Error al actualizar el producto', message: error.message });
    }
};

// 📌 Eliminar un producto
const deleteProduct = async (req, res) => {
    try {
        console.log(`DELETE /api/products/${req.params.pid} fue llamado`);
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);

        if (!deletedProduct) {
            return res.status(404).json({ error: '❌ Producto no encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: '❌ Error al eliminar el producto', message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};