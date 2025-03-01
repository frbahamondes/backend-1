const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model'); // Importamos el modelo de carrito
const Product = require('../models/product.model'); // Importamos el modelo de productos

// 📌 Obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        console.log('GET /api/carts fue llamado');
        const carts = await Cart.find().populate('products.product'); // Populate para obtener detalles de productos
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos', message: error.message });
    }
});

// 📌 Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        console.log('POST /api/carts fue llamado');
        const newCart = new Cart({ products: [] });
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito', message: error.message });
    }
});

// 📌 Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        console.log(`GET /api/carts/${req.params.cid} fue llamado`);
        const cart = await Cart.findById(req.params.cid).populate('products.product');

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito', message: error.message });
    }
});

// 📌 Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        console.log(`POST /api/carts/${req.params.cid}/product/${req.params.pid} fue llamado`);
        const { cid, pid } = req.params;

        // Buscar carrito y producto
        const cart = await Cart.findById(cid);
        const product = await Product.findById(pid);

        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

        // Buscar si el producto ya está en el carrito
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex >= 0) {
            cart.products[productIndex].quantity += 1; // Incrementamos la cantidad
        } else {
            cart.products.push({ product: pid, quantity: 1 }); // Agregamos el producto al carrito
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito', message: error.message });
    }
});

// 📌 Eliminar un carrito por ID
router.delete('/:cid', async (req, res) => {
    try {
        console.log(`DELETE /api/carts/${req.params.cid} fue llamado`);
        const deletedCart = await Cart.findByIdAndDelete(req.params.cid);

        if (!deletedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el carrito', message: error.message });
    }
});

module.exports = router;