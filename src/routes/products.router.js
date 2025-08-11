const express = require('express'); 
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');

// 🔒 Importar middleware para proteger rutas
const { authorizeRoles } = require('../middleware/auth.middleware');

const router = express.Router();

// 📦 Rutas públicas o sin protección
router.get('/', getAllProducts);
router.get('/:pid', getProductById);

// 🔒 Rutas protegidas solo para administradores
router.post('/', authorizeRoles(['admin']), createProduct);
router.put('/:pid', authorizeRoles(['admin']), updateProduct);
router.delete('/:pid', authorizeRoles(['admin']), deleteProduct);

module.exports = router;