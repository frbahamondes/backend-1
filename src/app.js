// 🔹 Importaciones necesarias
require('dotenv').config();
const express = require('express'); // 👈 FALTA
const path = require('path'); // 👈 FALTA
const fs = require('fs'); // 👈 FALTA
const { engine } = require('express-handlebars'); // 👈 FALTA

console.log('🔧 URI de conexión:', process.env.MONGO_URI);

const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
require('./config/passport.config');

// 🔹 Importar rutas
const sessionsRouter = require('./routes/sessions.router');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const usersRouter = require('./routes/users.routes'); // ✅ CORREGIDA

const { hashPassword } = require('./utils.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 🔹 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('🟢 Conectado a MongoDB Atlas');

        const UserModel = require('./models/user.model');
        const emailPrueba = 'coder@coder.com';

        const usuarioExistente = await UserModel.findOne({ email: emailPrueba });

        if (!usuarioExistente) {
            await UserModel.create({
                first_name: 'Coder',
                last_name: 'House',
                email: emailPrueba,
                age: 25,
                password: hashPassword('coder123'),
                role: 'admin'
            });
            console.log('👤 Usuario de prueba creado');
        } else {
            console.log('ℹ️ El usuario de prueba ya existe');
        }
    })
    .catch(error => console.error('🔴 Error conectando a MongoDB:', error));

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
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hora
    }
}));

// ✅ Inicializar Passport
app.use(passport.initialize());

// 🔹 Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter); // 👈 Esta es la nueva ruta modularizada
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