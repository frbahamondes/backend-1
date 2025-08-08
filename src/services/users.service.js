const userDao = require('../dao/mongo/user.mongo');

const findUserByEmail = async (email) => {
    return await userDao.getByEmail(email);
};

const createUser = async (userData) => {
    return await userDao.create(userData);
};

module.exports = {
    findUserByEmail,
    createUser
};