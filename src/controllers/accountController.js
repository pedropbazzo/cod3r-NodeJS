const AccountModel = require('../models/accountModel');

class AccountController {
  static async index(req, res, next) {
    try {
      const result = await AccountModel.listAccounts(req.id);

      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  static async show(req, res, next) {
    try {
      const { id } = req.params;
      const result = await AccountModel.findAccount(id, req.id);

      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  static async store(req, res, next) {
    try {
      const { name } = req.body;

      const result = await AccountModel.createAccount({
        name,
        user_id: req.id,
      });

      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const account = req.body;

      await AccountModel.updateAccount(id, account, req.id);

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  }

  static async destroy(req, res, next) {
    try {
      const { id } = req.params;

      await AccountModel.removeAccount(id, req.id);

      return res.sendStatus(200);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = AccountController;
