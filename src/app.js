// 🔹 Importaciones necesarias
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { engine } = require('express-handlebars');

const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const passport = require('passport');

const connectDB = require('./config/db');
require('./config/passport.config');

const sessionsRouter = require('./routes/sessions.router');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const usersRouter = require('./routes/users.router'); // ✅ CORREGIDO: antes decía .routes

const app = express();
const server = http.createServer(app);
const io = new Server(server);

connectDB(); // 👈 conexión a MongoDB

// 🔹 Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// 🔹 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 Middleware de sesión
app.use(session({
    secret: 'secretoCoder123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}));

// ✅ Inicializar Passport
app.use(passport.initialize());

// 🔹 Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter); // ✅ Usa el router fusionado
app.use('/api/sessions', sessionsRouter);

// 🔹 WebSockets
io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado');

    const leerProductos = () => {
        const filePath = path.join(__dirname, 'data', 'products.json');
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    };

    const escribirProductos = (productos) => {
        const filePath = path.join(__dirname, 'data', 'products.json');
        fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
    };

    const enviarProductosActualizados = () => {
        const productos = leerProductos();
        io.emit('actualizarProductos', productos);
        console.log('📢 Nueva lista de productos enviada');
    };

    socket.on('agregarProducto', (nuevoProducto) => {
        const productos = leerProductos();
        const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;

        const productoConValores = {
            id: nuevoId,
            title: nuevoProducto.title || "Sin nombre",
            description: nuevoProducto.description || "Sin descripción",
            price: nuevoProducto.price || 0,
            category: nuevoProducto.category || "Sin categoría",
            stock: nuevoProducto.stock || 10,
            status: nuevoProducto.status !== undefined ? nuevoProducto.status : true
        };

        productos.push(productoConValores);
        escribirProductos(productos);
        enviarProductosActualizados();
    });

    socket.on('eliminarProducto', (id) => {
        let productos = leerProductos();
        productos = productos.filter(p => p.id != id);
        escribirProductos(productos);
        enviarProductosActualizados();
    });

    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado');
    });
});

// 🔹 Puerto
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});