// src/routes/views.router.js
const express = require('express');
const Product = require('../models/product.model'); // 📌 Importamos el modelo de productos
const Cart = require('../models/cart.model'); // 📌 Importamos el modelo de carritos
const router = express.Router();

// 📌 Ruta para renderizar la vista principal
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('home', { products });
    } catch (error) {
        console.error('❌ Error al obtener productos:', error);
        res.status(500).send('Error al cargar productos');
    }
});

// 📌 Ruta para la vista en tiempo real con productos desde MongoDB
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('❌ Error al obtener productos en tiempo real:', error);
        res.status(500).send('Error al cargar productos en tiempo real');
    }
});

// 📌 Ruta para mostrar todos los productos con paginación y filtros
router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, category, sort } = req.query;
        const filter = category ? { category } : {};
        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOption,
            lean: true
        };

        const products = await Product.paginate(filter, options);

        const prevLink = products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}` : null;
        const nextLink = products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}` : null;

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

// 📌 🚀 Ruta para mostrar detalles de un producto
router.get('/products/:pid', async (req, res) => {
    try {
        console.log(`🔍 Buscando producto con ID: ${req.params.pid}`);

        const product = await Product.findById(req.params.pid).lean();

        if (!product) {
            console.error('❌ Producto no encontrado');
            return res.status(404).send('Producto no encontrado');
        }

        res.render('productDetail', { product });
    } catch (error) {
        console.error('❌ Error al obtener producto:', error);
        res.status(500).send('Error al cargar el producto');
    }
});

// 📌 🚀 Ruta para mostrar un carrito específico en la vista 🛒
router.get('/carts/:cid', async (req, res) => {
    try {
        console.log(`🛒 Buscando carrito con ID: ${req.params.cid}`);

        const cart = await Cart.findById(req.params.cid).populate('products.product').lean();

        if (!cart) {
            console.error('❌ Carrito no encontrado');
            return res.status(404).send('Carrito no encontrado');
        }

        res.render('carts', { cart });
    } catch (error) {
        console.error('❌ Error al obtener el carrito:', error);
        res.status(500).send('Error al cargar el carrito');
    }
});

// 🆕 📌 Ruta para mostrar el formulario de login con mensaje opcional
router.get('/login', (req, res) => {
    const success = req.query.success === '1'; // ✅ Detectamos si viene ?success=1
    res.render('login', { success }); // 👈 Pasamos la variable a la vista
});

// 📌 Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = router;