const UserModel = require('../models/userModel');

class UserController {
  static async index(req, res, next) {
    try {
      const users = await UserModel.listUsers();

      return res.json(users);
    } catch (err) {
      return next(err);
    }
  }

  static async store(req, res, next) {
    try {
      const result = await UserModel.createUser(req.body);

      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = UserController;
