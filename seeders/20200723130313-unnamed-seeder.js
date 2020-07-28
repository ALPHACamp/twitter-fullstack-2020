'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: true,
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: false,
      name: 'user1',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: false,
      name: 'user2',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    queryInterface.bulkInsert('Users',
      Array.from({ length: 20 }).map(data =>
        ({
          email: faker.name.findName() + '@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: false,
          name: faker.name.findName(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {});

    return queryInterface.bulkInsert('Tweets',
      Array.from({ length: 60 }).map(d =>
        ({
          UserId: Math.floor(Math.random() * 24),
          description: faker.lorem.text().substring(0, 50),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    return queryInterface.bulkDelete('Tweets', null, {})
  }
};
