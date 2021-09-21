'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'account0',
      name: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'account1',
      name: faker.name.findName(),
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      avatar: `https://randomuser.me/api/portraits/women/${Math.round(Math.random() * 100)}.jpg`,
      cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
      description: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'account2',
      name: faker.name.findName(),
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      avatar: `https://randomuser.me/api/portraits/women/${Math.round(Math.random() * 100)}.jpg`,
      cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
      description: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'account3',
      name: faker.name.findName(),
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      avatar: `https://randomuser.me/api/portraits/women/${Math.round(Math.random() * 100)}.jpg`,
      cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
      description: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'account4',
      name: faker.name.findName(),
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      avatar: `https://randomuser.me/api/portraits/men/${Math.round(Math.random() * 100)}.jpg`,
      cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
      description: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'account5',
      name: faker.name.findName(),
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      avatar: `https://randomuser.me/api/portraits/men/${Math.round(Math.random() * 100)}.jpg`,
      cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
      description: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}