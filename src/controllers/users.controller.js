// src/controllers/users.controller.js
const { findUserByEmail, createUser } = require('../services/users.service');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user || user.password !== password) {
        return res.status(401).send({ status: 'error', message: 'Credenciales inválidas' });
    }

    res.send({ status: 'success', payload: user });
};

const registerUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return res.status(400).send({ status: 'error', message: 'El usuario ya existe' });
    }

    const newUser = await createUser({ first_name, last_name, email, password });
    res.send({ status: 'success', payload: newUser });
};

module.exports = {
    loginUser,
    registerUser
};