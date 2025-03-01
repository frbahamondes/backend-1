const express = require('express');
const Product = require('../models/product.model'); // 📌 Importamos el modelo de MongoDB
const router = express.Router();

// 📌 Ruta para renderizar la vista home con productos desde MongoDB
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().lean(); // 🔹 Agregamos .lean() para que Handlebars pueda renderizar los datos
        res.render('home', { products });
    } catch (error) {
        console.error('❌ Error al obtener productos:', error);
        res.status(500).send('Error al cargar productos');
    }
});

// 📌 Ruta para la vista en tiempo real con productos desde MongoDB
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find().lean(); // 🔹 Agregamos .lean() aquí también
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('❌ Error al obtener productos en tiempo real:', error);
        res.status(500).send('Error al cargar productos en tiempo real');
    }
});

module.exports = router;