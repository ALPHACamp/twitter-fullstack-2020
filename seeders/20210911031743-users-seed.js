'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      isAdmin: true,
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
      isAdmin: false,
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
      isAdmin: false,
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
      isAdmin: false,
      name: 'test3',
      avatar: 'https://imgur.com/a/NSGu4qr',
      cover: 'https://imgur.com/a/5qR6wVT',
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user4',
      email: 'test4@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'test4',
      avatar: 'https://imgur.com/a/zA6um7Z',
      cover: 'https://w.wallhaven.cc/full/45/wallhaven-4528o9.jpg',
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
