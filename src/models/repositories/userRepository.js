const knex = require('../../config/db');

class UserRepository {
  static find() {
    return knex('users').select();
  }

  static findByMail(mail) {
    return knex('users')
      .select()
      .where({ mail });
  }

  static create(user) {
    return knex('users').insert(user, '*');
  }
}

module.exports = UserRepository;
