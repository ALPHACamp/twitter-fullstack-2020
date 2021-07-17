'use strict';
const bcrypt = require('bcryptjs')


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'Admin',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: true,
      id: 1,
      name: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user11',
      email: 'user11@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: false,
      id: 2,
      name: 'user11',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: false,
      id: 3,
      name: 'user2',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user3',
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: false,
      id: 4,
      name: 'user3',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user4',
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: false,
      id: 5,
      name: 'user4',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user5',
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: false,
      id: 6,
      name: 'user5',
      createdAt: new Date(),
      updatedAt: new Date()
    },], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
