const express = require('express');
const Product = require('../models/product.model'); // 📌 Importamos el modelo de MongoDB
const router = express.Router();

// 📌 Ruta para renderizar la vista home con productos desde MongoDB
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().lean(); // 🔹 Obtener productos desde MongoDB
        res.render('home', { products });
    } catch (error) {
        console.error('❌ Error al obtener productos:', error);
        res.status(500).send('Error al cargar productos');
    }
});

// 📌 Ruta para la vista en tiempo real con productos desde MongoDB
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find().lean(); // 🔹 Obtener productos desde MongoDB
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('❌ Error al obtener productos en tiempo real:', error);
        res.status(500).send('Error al cargar productos en tiempo real');
    }
});

// 📌 Ruta para la vista de productos con paginación y filtros
router.get('/products', async (req, res) => {
    try {
        console.log('GET /products fue llamado');

        // 📌 Obtener parámetros opcionales desde la URL
        const { limit = 10, page = 1, category, sort } = req.query;
        const filter = category ? { category } : {};
        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

        // 📌 Configuración de paginación
        const options = { page: parseInt(page), limit: parseInt(limit), sort: sortOption, lean: true };

        // 📌 Obtener productos paginados con filtros
        const products = await Product.paginate(filter, options);

        // 📌 Generar links de paginación
        const prevLink = products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}` : null;
        const nextLink = products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}` : null;

        // 📌 Renderizar la vista products.handlebars
        res.render('products', {
            products: products.docs,
            totalPages: products.totalPages,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        console.error('❌ Error al obtener productos:', error);
        res.status(500).send('Error al cargar productos');
    }
});

module.exports = router;