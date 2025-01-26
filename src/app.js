const express = require('express');
const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Importamos los routers
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

// Rutas base
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Configuración del puerto
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});