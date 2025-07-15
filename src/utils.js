// src/utils.js
const bcrypt = require('bcrypt');

const hashPassword = (password) => bcrypt.hashSync(password, 10);

const validatePassword = (password, hashedPassword) =>
    bcrypt.compareSync(password, hashedPassword);

module.exports = {
    hashPassword,
    validatePassword
};