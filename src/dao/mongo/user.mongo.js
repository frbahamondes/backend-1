// src/dao/mongo/user.mongo.js
const UserModel = require('../../models/user.model');

class UserMongoDAO {
    async getByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async getById(id) {
        return await UserModel.findById(id);
    }

    async create(userData) {
        return await UserModel.create(userData);
    }

    async update(id, updateData) {
        return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await UserModel.findByIdAndDelete(id);
    }

    async getAll() {
        return await UserModel.find();
    }
}

module.exports = new UserMongoDAO();