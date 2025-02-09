const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const http = require('http'); // Importamos http
const { Server } = require('socket.io'); // Importamos socket.io

const app = express();
const server = http.createServer(app); // Creamos el servidor HTTP
const io = new Server(server); // Asociamos socket.io al servidor

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
    
    // Leer productos desde el archivo JSON
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

    res.render('home', { products }); // Pasamos los productos a la vista
});

// Rutas base
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Configuración de WebSockets
io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado');

    // Enviar un mensaje de bienvenida al cliente
    socket.emit('mensaje', 'Bienvenido al servidor de WebSockets');

    // Evento cuando el cliente se desconecta
    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado');
    });
});

// Configuración del puerto
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});