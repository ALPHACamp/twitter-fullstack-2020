'use strict';

const bcrypt = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: 1,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'root',
      role: 'admin',
      account: 'root',
      avatar: `https://loremflickr.com/320/240/pepole/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user1',
      role: 'normal',
      account: 'user1',
      avatar: `https://loremflickr.com/320/240/pepole/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user2',
      role: 'normal',
      account: 'user2',
      avatar: `https://loremflickr.com/320/240/pepole/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 4,
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user3',
      role: 'normal',
      account: 'user3',
      avatar: `https://loremflickr.com/320/240/pepole/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 5,
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user4',
      role: 'normal',
      account: 'user4',
      avatar: `https://loremflickr.com/320/240/pepole/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 6,
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user5',
      role: 'normal',
      account: 'user5',
      avatar: `https://loremflickr.com/320/240/pepole/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
