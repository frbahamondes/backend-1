const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ruta para renderizar la vista home con productos
router.get('/', (req, res) => {
    const productsFilePath = path.join(__dirname, '../data/products.json');
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    res.render('home', { products });
});

// Ruta para la vista en tiempo real
router.get('/realtimeproducts', (req, res) => {
    const productsFilePath = path.join(__dirname, '../data/products.json');
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    res.render('realTimeProducts', { products });
});

module.exports = router;