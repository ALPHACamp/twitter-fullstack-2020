'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: 1,
      account: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'root',
      avatar: 'https://via.placeholder.com/300',
      introduction: faker.lorem.sentence().substring(0, 50),
      cover: 'https://via.placeholder.com/851x315',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 2,
      account: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user1',
      avatar: 'https://via.placeholder.com/300',
      introduction: faker.lorem.sentence().substring(0, 50),
      cover: 'https://via.placeholder.com/851x315',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 3,
      account: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user2',
      avatar: 'https://via.placeholder.com/300',
      introduction: faker.lorem.sentence().substring(0, 50),
      cover: 'https://via.placeholder.com/851x315',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 4,
      account: 'user3',
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user3',
      avatar: 'https://via.placeholder.com/300',
      introduction: faker.lorem.sentence().substring(0, 50),
      cover: 'https://via.placeholder.com/851x315',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 5,
      account: 'user4',
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user4',
      avatar: 'https://via.placeholder.com/300',
      introduction: faker.lorem.sentence().substring(0, 50),
      cover: 'https://via.placeholder.com/851x315',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 6,
      account: 'user5',
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user5',
      avatar: 'https://via.placeholder.com/300',
      introduction: faker.lorem.sentence().substring(0, 50),
      cover: 'https://via.placeholder.com/851x315',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
