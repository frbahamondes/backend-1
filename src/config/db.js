// src/config/db.js
const mongoose = require('mongoose');
const { hashPassword } = require('../utils');
const UserModel = require('../models/user.model');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🟢 Conectado a MongoDB Atlas');

        const emailPrueba = 'coder@coder.com';
        const usuarioExistente = await UserModel.findOne({ email: emailPrueba });

        if (!usuarioExistente) {
            await UserModel.create({
                first_name: 'Coder',
                last_name: 'House',
                email: emailPrueba,
                age: 25,
                password: hashPassword('coder123'),
                role: 'admin'
            });
            console.log('👤 Usuario de prueba creado');
        } else {
            console.log('ℹ️ El usuario de prueba ya existe');
        }
    } catch (error) {
        console.error('🔴 Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;