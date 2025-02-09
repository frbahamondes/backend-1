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

// Middleware para manejar JSON y archivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Importamos los routers
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

// 📌 Ruta para renderizar la vista home con productos
app.get('/', (req, res) => {
    const productsFilePath = path.join(__dirname, 'data/products.json');
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    res.render('home', { products });
});

// 📌 Ruta para la vista en tiempo real (MODIFICADA)
app.get('/realtimeproducts', (req, res) => {
    const productsFilePath = path.join(__dirname, 'data/products.json');
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    res.render('realTimeProducts', { products });
});

// 📌 Rutas base de API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// 📌 Configuración de WebSockets
io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado');

    // Función para leer productos del archivo JSON
    const leerProductos = () => {
        const productsFilePath = path.join(__dirname, 'data/products.json');
        return JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    };

    // Función para escribir productos en el archivo JSON
    const escribirProductos = (productos) => {
        const productsFilePath = path.join(__dirname, 'data/products.json');
        fs.writeFileSync(productsFilePath, JSON.stringify(productos, null, 2));
    };

    // Enviar la lista de productos actualizada a todos los clientes
    const enviarProductosActualizados = () => {
        const productos = leerProductos();
        io.emit('actualizarProductos', productos);
        console.log('📢 Nueva lista de productos enviada a todos los clientes');
    };

    // 📌 Escuchar cuando un cliente agrega un producto
    socket.on('agregarProducto', (nuevoProducto) => {
        const productos = leerProductos();

        // Asignar un ID único al producto nuevo
        const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;

        // Asignar valores por defecto si no están presentes
        const productoConValores = {
            id: nuevoId,
            title: nuevoProducto.title || "Producto sin nombre",
            description: nuevoProducto.description || "Sin descripción",
            price: nuevoProducto.price || 0,
            category: nuevoProducto.category || "Sin categoría",
            stock: nuevoProducto.stock || 10,
            status: nuevoProducto.status !== undefined ? nuevoProducto.status : true
        };

        productos.push(productoConValores); // Agregarlo a la lista
        escribirProductos(productos); // Guardar cambios
        enviarProductosActualizados(); // Notificar a los clientes
    });

    // 📌 Escuchar cuando un cliente elimina un producto
    socket.on('eliminarProducto', (id) => {
        let productos = leerProductos();
        productos = productos.filter(p => p.id != id); // Filtrar el producto a eliminar
        escribirProductos(productos); // Guardar cambios
        enviarProductosActualizados(); // Notificar a los clientes
    });

    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado');
    });
});

// 📌 Configuración del puerto
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});