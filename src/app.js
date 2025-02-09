const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const http = require('http'); 
const { Server } = require('socket.io'); 

const app = express();
const server = http.createServer(app); 
const io = new Server(server); 

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar JSON
app.use(express.json());

// Importamos los routers
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

// Ruta para renderizar la vista home con productos
app.get('/', (req, res) => {
    const productsFilePath = path.join(__dirname, 'data/products.json');
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    res.render('home', { products });
});

// Rutas base
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Configuración de WebSockets
io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado');

    // Función para enviar la lista de productos a todos los clientes
    const sendProducts = () => {
        const productsFilePath = path.join(__dirname, 'data/products.json');
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        io.emit('actualizarProductos', products); // Enviar productos actualizados a todos los clientes
    };

    // Escuchar eventos de creación y eliminación de productos
    socket.on('productoAgregado', () => {
        sendProducts(); // Enviar lista actualizada
    });

    socket.on('productoEliminado', () => {
        sendProducts(); // Enviar lista actualizada
    });

    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado');
    });
});

// Configuración del puerto
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});