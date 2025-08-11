const express = require('express');
const router = express.Router();

const UserModel = require('../models/user.model');
const { validatePassword } = require('../utils');
const { isAuthenticated } = require('../middleware/auth.middleware');

// Usamos solo el controlador para register
const { registerUser } = require('../controllers/users.controller');

// 🔐 Ruta POST /login (login directo, maneja sesión)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const isValid = validatePassword(password, user.password);

        if (!isValid) {
            return res.status(403).json({ error: 'Contraseña incorrecta' });
        }

        req.session.user = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        };

        res.status(200).json({
            message: '¡Login exitoso!',
            user: req.session.user
        });

    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// 🧾 Ruta POST /register (usa controlador externo)
router.post('/register', registerUser);

// 🧠 Ruta GET /current (verifica la sesión)
router.get('/current', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'No hay usuario en sesión' });
    }

    res.status(200).json({
        user: req.session.user
    });
});

// 🔒 Ruta GET /logout (cierra sesión)
router.get('/logout', (req, res) => {
    if (req.session.user) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: 'Error al cerrar sesión' });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Sesión cerrada correctamente' });
        });
    } else {
        res.status(400).json({ error: 'No hay sesión activa' });
    }
});

// 🔐 Ruta protegida /perfil
router.get('/perfil', isAuthenticated, (req, res) => {
    res.status(200).json({
        mensaje: 'Perfil del usuario autenticado',
        usuario: req.session.user
    });
});

module.exports = router;