const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const productsFilePath = path.join(__dirname, '../data/products.json');

// Función para leer el archivo JSON
const readProductsFile = () => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error al leer el archivo products.json:', err);
        return [];
    }
};

// Función para escribir en el archivo JSON
const writeProductsFile = (data) => {
    try {
        fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error al escribir en el archivo products.json:', err);
    }
};

// 📌 Ruta para listar todos los productos
router.get('/', (req, res) => {
    console.log('GET /api/products fue llamado');
    const limit = req.query.limit;
    const data = readProductsFile();
    const products = limit ? data.slice(0, limit) : data;
    res.json(products);
});

// 📌 Ruta para obtener un producto por ID
router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    console.log(`GET /api/products/${pid} fue llamado`);

    const data = readProductsFile();
    const product = data.find(p => p.id == pid);

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

// 📌 Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
    console.log('POST /api/products fue llamado');
    const data = readProductsFile();
    const newProduct = req.body;

    // Validar que el body contiene los campos obligatorios
    if (!newProduct.title || !newProduct.price || !newProduct.code) {
        return res.status(400).json({ error: 'Faltan campos obligatorios (title, price, code)' });
    }

    // Autogenerar un ID único
    const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;

    // Asignar valores por defecto si no están presentes
    const productWithDefaults = {
        id: newId,
        title: newProduct.title,
        description: newProduct.description || "Sin descripción",
        price: newProduct.price,
        code: newProduct.code,
        category: newProduct.category || "Sin categoría",
        stock: newProduct.stock || 10,
        status: newProduct.status !== undefined ? newProduct.status : true
    };

    data.push(productWithDefaults);
    writeProductsFile(data);
    res.status(201).json(productWithDefaults);
});

// 📌 Ruta para actualizar un producto por ID
router.put('/:pid', (req, res) => {
    console.log(`PUT /api/products/${req.params.pid} fue llamado`);
    const { pid } = req.params;
    const data = readProductsFile();
    const updatedProduct = req.body;

    const productIndex = data.findIndex(p => p.id == pid);
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    data[productIndex] = { ...data[productIndex], ...updatedProduct, id: data[productIndex].id };
    writeProductsFile(data);
    res.json(data[productIndex]);
});

// 📌 Ruta para eliminar un producto por ID
router.delete('/:pid', (req, res) => {
    console.log(`DELETE /api/products/${req.params.pid} fue llamado`);
    const { pid } = req.params;
    const data = readProductsFile();

    const newData = data.filter(p => p.id != pid);
    if (newData.length === data.length) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    writeProductsFile(newData);
    res.status(204).send();
});

module.exports = router;