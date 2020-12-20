const faker = require('faker');

module.exports = () => ({
  name: faker.random.alphaNumeric(6),
});
