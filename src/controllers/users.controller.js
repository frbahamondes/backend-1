// src/controllers/users.controller.js
const { findUserByEmail, createUser } = require('../services/users.service');

const registerUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return res.status(400).send({ status: 'error', message: 'El usuario ya existe' });
    }

    // ✅ Asignación de rol según el correo
    const role = email === 'adminCoder@coder.com' ? 'admin' : 'user';

    const newUser = await createUser({ first_name, last_name, email, password, role });

    res.send({ status: 'success', payload: newUser });
};

module.exports = {
    registerUser
};