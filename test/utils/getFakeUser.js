const faker = require('faker');

module.exports = () => ({
  name: faker.name.findName(),
  mail: faker.internet.email(),
  passwd: faker.internet.password(6),
});
