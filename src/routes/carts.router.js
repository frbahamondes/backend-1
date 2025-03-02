const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model'); // 📌 Importamos el modelo de carrito
const Product = require('../models/product.model'); // 📌 Importamos el modelo de productos

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

// 📌 🚀 Agregar un producto a un carrito (crea el carrito si no existe)
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        console.log(`POST /api/carts/${req.params.cid}/product/${req.params.pid} fue llamado`);
        const { cid, pid } = req.params;

        // 📌 Buscar carrito, si no existe, crear uno nuevo
        let cart = await Cart.findById(cid);
        if (!cart) {
            console.log('🛒 No se encontró el carrito, creando uno nuevo...');
            cart = new Cart({ products: [] });
            await cart.save();
        }

        // 📌 Verificar si el producto existe
        const product = await Product.findById(pid);
        if (!product) return res.status(404).json({ error: '❌ Producto no encontrado' });

        // 📌 Buscar si el producto ya está en el carrito
        const existingProduct = cart.products.find(p => p.product.equals(pid));

        if (existingProduct) {
            existingProduct.quantity += 1; // Incrementar cantidad
        } else {
            cart.products.push({ product: pid, quantity: 1 }); // Agregar nuevo producto
        }

        await cart.save();
        res.json({ message: '✅ Producto agregado al carrito', cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito', message: error.message });
    }
});

// 📌 Eliminar un producto específico de un carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        console.log(`DELETE /api/carts/${req.params.cid}/products/${req.params.pid} fue llamado`);
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== pid);

        await cart.save();
        res.json({ message: '❌ Producto eliminado del carrito', cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito', message: error.message });
    }
});

// 📌 🚀 Vaciar un carrito sin eliminarlo
router.delete('/:cid', async (req, res) => {
    try {
        console.log(`DELETE /api/carts/${req.params.cid} fue llamado`);
        const { cid } = req.params;

        // 📌 Buscar el carrito
        let cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        // 📌 Vaciar los productos sin eliminar el carrito
        cart.products = [];
        await cart.save();

        res.json({ message: '🗑 Carrito vaciado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al vaciar el carrito', message: error.message });
    }
});

// 📌 Actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
    try {
        console.log(`PUT /api/carts/${req.params.cid} fue llamado`);
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = products;
        await cart.save();

        res.json({ message: '🛒 Carrito actualizado', cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito', message: error.message });
    }
});

// 📌 Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        console.log(`PUT /api/carts/${req.params.cid}/products/${req.params.pid} fue llamado`);
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
        }

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        res.json({ message: '🔄 Cantidad actualizada', cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto', message: error.message });
    }
});

module.exports = router;