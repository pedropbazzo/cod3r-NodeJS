const UserModel = require('../models/userModel');

class AuthController {
  static async login(req, res, next) {
    try {
      const { mail, passwd } = req.body;

      const token = await UserModel.getToken(mail, passwd);

      return res.json({ token });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = AuthController;
