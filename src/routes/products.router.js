const express = require('express');
const mongoosePaginate = require('mongoose-paginate-v2'); // 📌 Asegurar que el plugin esté cargado
const Product = require('../models/product.model'); // Importamos el modelo de productos
const router = express.Router();

// 📌 Obtener todos los productos con filtros opcionales (limit, page, sort, query)
router.get('/', async (req, res) => {
    try {
        console.log('GET /api/products fue llamado');
        const { limit = 10, page = 1, sort, query } = req.query;

        // Creamos un objeto de filtro según query param (por ejemplo, filtrar por categoría o disponibilidad)
        let filter = {};
        if (query) {
            filter = { $or: [{ category: query }, { status: query === 'true' }] };
        }

        // Creamos opciones para paginación y ordenamiento
        let options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
        };

        // Usamos `paginate()` de Mongoose (necesita `mongoose-paginate-v2`)
        const products = await Product.paginate(filter, options);

        res.json({
            status: 'success',
            payload: products.docs, // Lista de productos
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos', message: error.message });
    }
});

// 📌 Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        console.log(`GET /api/products/${req.params.pid} fue llamado`);
        const product = await Product.findById(req.params.pid);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto', message: error.message });
    }
});

// 📌 Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        console.log('POST /api/products fue llamado');
        const { title, description, price, code, category, stock, status, thumbnails } = req.body;

        if (!title || !price || !code) {
            return res.status(400).json({ error: 'Faltan campos obligatorios (title, price, code)' });
        }

        const newProduct = new Product({
            title,
            description,
            price,
            code,
            category,
            stock,
            status,
            thumbnails,
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto', message: error.message });
    }
});

// 📌 Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
    try {
        console.log(`PUT /api/products/${req.params.pid} fue llamado`);
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto', message: error.message });
    }
});

// 📌 Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
    try {
        console.log(`DELETE /api/products/${req.params.pid} fue llamado`);
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto', message: error.message });
    }
});

module.exports = router;