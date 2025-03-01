const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2'); // 📌 Importar el plugin

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    category: String,
    stock: Number,
    status: { type: Boolean, default: true },
    thumbnails: { type: [String], default: [] } // 📌 Agregado (array vacío por defecto)
});

// 📌 Aplicar el plugin de paginación al esquema
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;