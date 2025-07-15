// src/routes/users.router.js
const express = require('express');
const router = express.Router();

const UserModel = require('../models/user.model');
const { validatePassword } = require('../utils');

// Ruta POST /login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validar datos
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

        // Si todo está ok
        res.status(200).json({
            message: '¡Login exitoso!',
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

module.exports = router;