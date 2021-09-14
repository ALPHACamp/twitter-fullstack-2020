'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: '@root',
      email: 'root@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      name: 'root',
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: '@user1',
      email: 'test1@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'test1',
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: '@user2',
      email: 'test2@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'test2',
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
