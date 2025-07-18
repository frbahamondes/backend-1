const express = require('express');
const router = express.Router();

const UserModel = require('../models/user.model');
const { validatePassword, hashPassword } = require('../utils');

// 🔐 Ruta POST /login
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

        // ✅ Guardar en sesión
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

// 🧾 Ruta POST /register
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

        await UserModel.create({
            first_name,
            last_name,
            email,
            age,
            password: hashPassword(password),
            role: 'user'
        });

        // ✅ Redirigir al login con mensaje de éxito
        return res.redirect('/login?success=1');

    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

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
            res.clearCookie('connect.sid'); // 💡 Elimina cookie de sesión
            res.status(200).json({ message: 'Sesión cerrada correctamente' });
        });
    } else {
        res.status(400).json({ error: 'No hay sesión activa' });
    }
});

module.exports = router;