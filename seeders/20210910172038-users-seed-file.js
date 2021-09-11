'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: faker.name.findName(),
      avatar: 'https://api.thecatapi.com/v1/images/search',
      cover: 'https://api.thecatapi.com/v1/images/search',
      description: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: faker.name.findName(),
      avatar: 'https://api.thecatapi.com/v1/images/search',
      cover: 'https://api.thecatapi.com/v1/images/search',
      description: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: faker.name.findName(),
      avatar: 'https://api.thecatapi.com/v1/images/search',
      cover: 'https://api.thecatapi.com/v1/images/search',
      description: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: faker.name.findName(),
      avatar: 'https://api.thecatapi.com/v1/images/search',
      cover: 'https://api.thecatapi.com/v1/images/search',
      description: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: faker.name.findName(),
      avatar: 'https://api.thecatapi.com/v1/images/search',
      cover: 'https://api.thecatapi.com/v1/images/search',
      description: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}