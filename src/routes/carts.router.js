const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Rutas de los archivos JSON
const cartsFilePath = path.join(__dirname, '../data/carts.json');
const productsFilePath = path.join(__dirname, '../data/products.json'); // Ruta para validar productos

// Función para leer el archivo JSON de carritos
const readCartsFile = () => {
    try {
        const data = fs.readFileSync(cartsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error al leer el archivo carts.json:', err);
        return []; // Si falla, devolvemos un array vacío
    }
};

// Función para leer el archivo JSON de productos
const readProductsFile = () => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error al leer el archivo products.json:', err);
        return []; // Si falla, devolvemos un array vacío
    }
};

// Función para escribir en el archivo JSON de carritos
const writeCartsFile = (data) => {
    try {
        fs.writeFileSync(cartsFilePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error al escribir en el archivo carts.json:', err);
    }
};

// 📌 Nueva ruta: Obtener todos los carritos
router.get('/', (req, res) => {
    console.log('GET /api/carts fue llamado'); // Log de depuración
    const carts = readCartsFile();
    res.json(carts);
});

// 📌 Crear un nuevo carrito
router.post('/', (req, res) => {
    console.log('POST /api/carts fue llamado'); // Log de depuración
    const carts = readCartsFile();

    // Generar un ID único para el carrito
    const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
    const newCart = {
        id: newId,
        products: [] // Carrito vacío
    };

    carts.push(newCart); // Agregar el carrito a la lista
    writeCartsFile(carts); // Guardar en el archivo
    console.log(`Carrito creado con ID: ${newId}`); // Log de éxito
    res.status(201).json(newCart); // Responder con el carrito creado
});

// 📌 Obtener productos de un carrito específico
router.get('/:cid', (req, res) => {
    console.log(`GET /api/carts/${req.params.cid} fue llamado`); // Log de depuración
    const { cid } = req.params;
    const carts = readCartsFile();
    const cart = carts.find(c => c.id == cid);
    if (!cart) {
        console.error(`Carrito con ID ${cid} no encontrado`);
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart.products);
});

// 📌 Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    console.log(`POST /api/carts/${req.params.cid}/product/${req.params.pid} fue llamado`); // Log de depuración
    const { cid, pid } = req.params;
    const carts = readCartsFile();
    const cart = carts.find(c => c.id == cid);

    if (!cart) {
        console.error(`Carrito con ID ${cid} no encontrado`);
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Leer productos para verificar si existe el producto con ID pid
    const products = readProductsFile();
    console.log('Productos cargados desde products.json:', products);
    const productExists = products.find(p => p.id == Number(pid)); // Comparación débil para evitar problemas de tipo

    if (!productExists) {
        console.error(`Producto con ID ${pid} no encontrado`);
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Buscar si el producto ya existe en el carrito
    const productIndex = cart.products.findIndex(p => p.product == pid);
    if (productIndex >= 0) {
        cart.products[productIndex].quantity += 1; // Incrementar cantidad
        console.log(`Producto con ID ${pid} incrementado en el carrito ${cid}`);
    } else {
        cart.products.push({ product: pid, quantity: 1 }); // Agregar nuevo producto
        console.log(`Producto con ID ${pid} agregado al carrito ${cid}`);
    }

    writeCartsFile(carts); // Guardar cambios
    res.json(cart);
});

module.exports = router;