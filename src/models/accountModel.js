/* eslint-disable camelcase */
const createError = require('http-errors');
const AccountRepository = require('./repositories/accountRepository');

class AccountModel {
  static listAccounts(user_id) {
    return AccountRepository.find({ user_id });
  }

  static async findAccount(id, user_id) {
    const result = await AccountRepository.findById(id);

    if (result.length === 0) {
      throw new createError.NotFound('account not found');
    }

    if (result[0].user_id !== user_id) {
      throw new createError.Forbidden('this account is not yours');
    }

    return result;
  }

  static async createAccount(account) {
    const accountInDB = await AccountRepository.find({
      name: account.name,
      user_id: account.user_id,
    });

    if (accountInDB.length > 0) {
      throw new createError.BadRequest('name already exists');
    }

    return AccountRepository.create(account);
  }

  static async updateAccount(id, account, user_id) {
    const { name } = account;

    if (!name || name.trim() === '') {
      throw new createError.BadRequest('Name must be a non-empty string.');
    }

    const accountInDB = await AccountRepository.findById(id);
    if (accountInDB[0].user_id !== user_id) {
      throw new createError.Forbidden('this account is not yours');
    }

    return AccountRepository.updateName(id, account.name);
  }

  static async removeAccount(id, user_id) {
    const accountInDB = await AccountRepository.findById(id);
    if (accountInDB[0].user_id !== user_id) {
      throw new createError.Forbidden('this account is not yours');
    }

    return AccountRepository.delete(id);
  }
}

module.exports = AccountModel;
