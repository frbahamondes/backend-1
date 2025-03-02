const express = require('express');
const Product = require('../models/product.model'); // 📌 Importamos el modelo de productos
const router = express.Router();

// 📌 Obtener todos los productos con filtros opcionales (limit, page, sort, query)
router.get('/', async (req, res) => {
    try {
        console.log('GET /api/products fue llamado');
        const { limit = 10, page = 1, sort, query } = req.query;

        // 📌 Creación de filtros para búsqueda
        let filter = {};
        if (query) {
            filter.category = query; // Filtra por categoría exacta
        }

        // 📌 Configuración de ordenamiento
        let sortOption = {};
        if (sort === 'asc') sortOption.price = 1;
        if (sort === 'desc') sortOption.price = -1;

        // 📌 Configuración de paginación
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOption,
            lean: true, // Permite devolver datos en formato JSON plano para Handlebars
        };

        // 📌 Obtener productos paginados con filtros
        const products = await Product.paginate(filter, options);

        // 📌 Construcción de enlaces de paginación con filtros y ordenamiento
        const queryParams = new URLSearchParams({ limit, sort, query }).toString();
        const prevLink = products.hasPrevPage ? `/api/products?page=${products.prevPage}&${queryParams}` : null;
        const nextLink = products.hasNextPage ? `/api/products?page=${products.nextPage}&${queryParams}` : null;

        res.json({
            status: 'success',
            payload: products.docs, // Lista de productos
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
});

// 📌 Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        console.log(`GET /api/products/${req.params.pid} fue llamado`);
        const product = await Product.findById(req.params.pid);

        if (!product) {
            return res.status(404).json({ error: '❌ Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: '❌ Error al obtener el producto', message: error.message });
    }
});

// 📌 Agregar un nuevo producto a MongoDB
router.post('/', async (req, res) => {
    try {
        console.log('POST /api/products fue llamado');
        const { title, description, price, code, category, stock, status, thumbnails } = req.body;

        // 📌 Validación de campos obligatorios
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
            status: status !== undefined ? status : true, // Si no se envía, por defecto es true
            thumbnails
        });

        await newProduct.save();
        res.status(201).json({ message: '✅ Producto agregado con éxito', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: '❌ Error al agregar el producto', message: error.message });
    }
});

// 📌 Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
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
});

// 📌 Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
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
});

module.exports = router;