# Primera Pre-entrega – Comisión XXXX – Programación Backend I

## Desarrollo Avanzado de Backend - Coderhouse

---

### **Consigna del proyecto**
Desarrollar un servidor que contenga los endpoints y servicios necesarios para gestionar los productos y carritos de compras de un e-commerce.

El servidor está basado en **Node.js** y utiliza **Express.js**, escuchando en el puerto **8080**. Contiene dos grupos de rutas principales:

- `/products`: Para gestionar los productos.
- `/carts`: Para gestionar los carritos de compras.

La persistencia de datos se realiza mediante el uso de archivos JSON:

- **`products.json`** para los productos.
- **`carts.json`** para los carritos.

---

### **Rutas y Funcionalidades**

#### **Sección Productos**

1. **Obtener todos los productos**
   - **URL Endpoint:** `GET http://localhost:8080/api/products`
   - **Descripción:** Muestra todos los productos almacenados en el archivo `products.json`.
   - **Ejecución:**
     ```json
     [
       {
         "id": 1,
         "title": "Tablet Pro",
         "description": "Una tablet moderna y potente.",
         "code": "TAB789",
         "price": 800,
         "status": true,
         "stock": 15,
         "category": "Tecnología",
         "thumbnails": [
           "https://example.com/tablet.jpg"
         ]
       }
     ]
     ```

2. **Obtener un producto por ID**
   - **URL Endpoint:** `GET http://localhost:8080/api/products/:pid`
   - **Descripción:** Devuelve los detalles del producto con el ID especificado.
   - **Parámetros:**
     - `pid`: ID del producto.
   - **Ejecución:**
     ```json
     {
       "id": 1,
       "title": "Tablet Pro",
       "description": "Una tablet moderna y potente.",
       "code": "TAB789",
       "price": 800,
       "status": true,
       "stock": 15,
       "category": "Tecnología",
       "thumbnails": [
         "https://example.com/tablet.jpg"
       ]
     }
     ```

3. **Crear un nuevo producto**
   - **URL Endpoint:** `POST http://localhost:8080/api/products`
   - **Descripción:** Permite agregar un producto.
   - **Parámetros obligatorios (en el cuerpo del request):**
     - `title`, `description`, `code`, `price`, `stock`, `category`.
   - **Ejecución:**
     ```json
     {
       "id": 2,
       "title": "Smartphone",
       "description": "Un smartphone moderno.",
       "code": "SP123",
       "price": 1000,
       "status": true,
       "stock": 20,
       "category": "Tecnología",
       "thumbnails": ["https://example.com/smartphone.jpg"]
     }
     ```

4. **Editar un producto**
   - **URL Endpoint:** `PUT http://localhost:8080/api/products/:pid`
   - **Descripción:** Permite actualizar los detalles del producto con el ID especificado.
   - **Parámetros obligatorios:** Los mismos que al crear un producto.
   - **Ejecución:**
     ```json
     {
       "id": 1,
       "title": "Tablet Pro Max",
       "description": "Actualización del producto.",
       "code": "TAB789",
       "price": 850,
       "status": true,
       "stock": 10,
       "category": "Tecnología",
       "thumbnails": ["https://example.com/tabletpro.jpg"]
     }
     ```

5. **Eliminar un producto**
   - **URL Endpoint:** `DELETE http://localhost:8080/api/products/:pid`
   - **Descripción:** Elimina el producto con el ID especificado.

---

#### **Sección Carrito**

1. **Crear un carrito**
   - **URL Endpoint:** `POST http://localhost:8080/api/carts`
   - **Descripción:** Crea un nuevo carrito vacío con un ID autogenerado.
   - **Ejecución:**
     ```json
     {
       "id": 1,
       "products": []
     }
     ```

2. **Obtener los productos de un carrito**
   - **URL Endpoint:** `GET http://localhost:8080/api/carts/:cid`
   - **Descripción:** Lista todos los productos de un carrito específico.
   - **Parámetros:**
     - `cid`: ID del carrito.
   - **Ejecución:**
     ```json
     {
       "id": 1,
       "products": [
         {
           "product": "1",
           "quantity": 2
         }
       ]
     }
     ```

3. **Agregar un producto a un carrito**
   - **URL Endpoint:** `POST http://localhost:8080/api/carts/:cid/product/:pid`
   - **Descripción:** Agrega un producto al carrito especificado. Si el producto ya existe en el carrito, incrementa la cantidad.
   - **Parámetros:**
     - `cid`: ID del carrito.
     - `pid`: ID del producto.
   - **Validaciones adicionales:** Verifica si el producto existe antes de agregarlo.
   - **Ejecución:**
     ```json
     {
       "id": 1,
       "products": [
         {
           "product": "1",
           "quantity": 3
         }
       ]
     }
     ```

---

### **Cómo ejecutar el proyecto**

1. **Clona este repositorio:**
   ```bash
   git clone <URL del repositorio>
   cd ecommerce
   npm install

2. **Ejecuta el servidor:**
   ```bash
   node src/app.js
 
3. **Prueba los endpoints con Postman o cualquier cliente de API.**