'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      name: 'root',
      avatar: 'https://randomuser.me/portraits/women/17.jpg',
      cover: 'https://w.wallhaven.cc/full/pk/wallhaven-pkw6y3.jpg',
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user1',
      email: 'test1@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'test1',
      avatar: 'https://randomuser.me/portraits/women/21.jpg',
      cover: 'https://w.wallhaven.cc/full/j3/wallhaven-j3339m.jpg',
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user2',
      email: 'test2@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'test2',
      avatar: 'https://randomuser.me/portraits/women/72.jpg',
      cover: 'https://w.wallhaven.cc/full/z8/wallhaven-z8odwg.jpg',
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user3',
      email: 'test3@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'test3',
      avatar: 'https://i.imgur.com/bI93UKe.jpg',
      cover: 'https://i.imgur.com/xSwUEid.jpg',
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user4',
      email: 'test4@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'test4',
      avatar: 'https://randomuser.me/portraits/women/73.jpg',
      cover: 'https://w.wallhaven.cc/full/8o/wallhaven-8oev1j.jpg',
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user5',
      email: 'test5@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'test5',
      avatar: 'https://i.imgur.com/8Jp9j1r.jpg',
      cover: 'https://w.wallhaven.cc/full/j3/wallhaven-j3339m.jpg',
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
