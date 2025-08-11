const userDao = require('../dao/mongo/user.mongo');
const { hashPassword } = require('../utils');

const findUserByEmail = async (email) => {
    return await userDao.getByEmail(email);
};

const createUser = async (userData) => {
    // Hash de la contraseña antes de guardar
    if (userData.password) {
        userData.password = hashPassword(userData.password);
    }

    return await userDao.create(userData);
};

module.exports = {
    findUserByEmail,
    createUser
};