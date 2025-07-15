// src/routes/sessions.router.js
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport'); // ✅ ESTA LÍNEA ES IMPORTANTE
const UserModel = require('../models/user.model');
const { validatePassword } = require('../utils');

const router = express.Router();

const JWT_SECRET = 'coderSecretJWT123'; // 🔐 Mejor moverlo luego a process.env

// 🆕 POST /jwtLogin → genera un token JWT
router.post('/jwtLogin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const isValid = validatePassword(password, user.password);
        if (!isValid) {
            return res.status(403).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login con JWT exitoso',
            token
        });

    } catch (error) {
        console.error('❌ Error en jwtLogin:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 🧠 Ruta protegida con JWT que devuelve al usuario actual
router.get('/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.status(200).json({
            message: 'Usuario autenticado correctamente con JWT',
            user: req.user
        });
    }
);

module.exports = router;