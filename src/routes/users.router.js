// src/routes/users.router.js
const express = require('express');
const router = express.Router();

const UserModel = require('../models/user.model');
const { validatePassword, hashPassword } = require('../utils'); // ✅ Agregado hashPassword

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

// ✅ Ruta POST /register
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'El usuario ya está registrado' });
        }

        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            age,
            password: hashPassword(password), // 🔐 Encriptar la contraseña
            role: 'user'
        });

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            user: {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

module.exports = router;