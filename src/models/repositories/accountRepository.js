const knex = require('../../config/db');

class AccountRepository {
  static find(filter = {}) {
    return knex('accounts')
      .select()
      .where(filter);
  }

  static findById(id) {
    return knex('accounts')
      .select()
      .where({ id });
  }

  static create(account) {
    return knex('accounts').insert(account, '*');
  }

  static updateName(id, name) {
    return knex('accounts')
      .where({ id })
      .update({ name });
  }

  static delete(id) {
    return knex('accounts')
      .where({ id })
      .delete();
  }
}

module.exports = AccountRepository;
