const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Relación con productos
            quantity: { type: Number, default: 1 }
        }
    ]
}, { toJSON: { virtuals: true } }); // Permite que `populate()` funcione correctamente

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;