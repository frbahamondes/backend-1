const userDao = require('../dao/mongo/user.mongo');
const { hashPassword, validatePassword } = require('../utils');
const UserDTO = require('../dto/user.dto');  // Importar DTO

const findUserByEmail = async (email) => {
    const user = await userDao.getByEmail(email);
    return user ? new UserDTO(user) : null;  // Retorna DTO o null si no encuentra usuario
};

const createUser = async (userData) => {
    // Hash de la contraseña antes de guardar
    if (userData.password) {
        userData.password = hashPassword(userData.password);
    }

    const newUser = await userDao.create(userData);
    return new UserDTO(newUser);  // Retorna DTO para no exponer datos sensibles
};

// Nueva función loginUser
const loginUser = async (email, password) => {
    const user = await userDao.getByEmail(email);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const isValid = validatePassword(password, user.password);
    if (!isValid) {
        throw new Error('Contraseña incorrecta');
    }

    return new UserDTO(user);
};

module.exports = {
    findUserByEmail,
    createUser,
    loginUser
};
