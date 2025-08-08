const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

const getCartById = async (id) => {
    return await Cart.findById(id).populate('products.product');
};

const createCart = async () => {
    return await Cart.create({ products: [] });
};

const addProductToCart = async (cartId, productId) => {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product: productId, quantity: 1 });
    }

    return await cart.save();
};

const updateCart = async (cartId, products) => {
    // products debe ser un array de objetos { product, quantity }
    return await Cart.findByIdAndUpdate(cartId, { products }, { new: true });
};

const removeProductFromCart = async (cartId, productId) => {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    return await cart.save();
};

const clearCart = async (cartId) => {
    return await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true });
};

module.exports = {
    getCartById,
    createCart,
    addProductToCart,
    updateCart,
    removeProductFromCart,
    clearCart
};
