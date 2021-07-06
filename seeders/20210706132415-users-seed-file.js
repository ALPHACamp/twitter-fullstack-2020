'use strict';

const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: 1,
      account: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user1',
      avatar: 'https://i.imgur.com/XuNZukl.jpg',
      cover: '',
      introduction: 'Hi~ my name is user1',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      account: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user2',
      avatar: '',
      cover: '',
      introduction: 'Hi~ my name is user2',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      account: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'root',
      avatar: 'https://i.imgur.com/ldZ2HCe.jpg',
      cover: '',
      introduction: 'Hi~ my name is root',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 4,
      account: 'elliotyou',
      email: 'aaa@aaa.aaa',
      password: bcrypt.hashSync('aaa', bcrypt.genSaltSync(10), null),
      name: 'Elliot',
      avatar: '',
      cover: '',
      introduction: 'Hi~ This is Elliot\'s introduction',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};