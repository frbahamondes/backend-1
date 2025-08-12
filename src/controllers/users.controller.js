const { findUserByEmail, createUser } = require('../services/users.service');
const UserDTO = require('../dto/user.dto');
const { validatePassword } = require('../utils');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    try {
        const user = await findUserByEmail(email);

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

        const userDTO = new UserDTO(user);

        res.status(200).json({
            message: '¡Login exitoso!',
            user: userDTO
        });

    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
};

const registerUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return res.status(400).send({ status: 'error', message: 'El usuario ya existe' });
    }

    const role = email === 'adminCoder@coder.com' ? 'admin' : 'user';

    const newUser = await createUser({ first_name, last_name, email, password, role });

    const userDTO = new UserDTO(newUser);

    res.send({ status: 'success', payload: userDTO });
};

module.exports = {
    loginUser,
    registerUser
};