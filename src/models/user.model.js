// src/models/user.model.js
const mongoose = require('mongoose');
const Cart = require('./cart.model'); // ✅ Importamos el modelo de carrito

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' }
});

// ✅ Middleware: crea un carrito automático si el usuario no lo tiene
userSchema.pre('save', async function (next) {
    if (!this.cart) {
        const newCart = await Cart.create({ products: [] });
        this.cart = newCart._id;
    }
    next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel; // 👈 ESTA LÍNEA es clave si usás require en app.js