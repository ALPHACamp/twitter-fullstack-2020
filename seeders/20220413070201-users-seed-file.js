'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      avatar: `https://loremflickr.com/320/240?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/480/180/nature/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user1',
      name: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('123', 10),
      introduction: faker.lorem.text().substring(0, 160),
      avatar: `https://loremflickr.com/320/240?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/480/180/nature/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user2',
      name: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('123', 10),
      introduction: faker.lorem.text().substring(0, 160),
      avatar: `https://loremflickr.com/320/240?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/480/180/nature/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user3',
      name: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('123', 10),
      introduction: faker.lorem.text().substring(0, 160),
      avatar: `https://loremflickr.com/320/240?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/480/180/nature/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user4',
      name: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('123', 10),
      introduction: faker.lorem.text().substring(0, 160),
      avatar: `https://loremflickr.com/320/240?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/480/180/nature/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user5',
      name: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('123', 10),
      introduction: faker.lorem.text().substring(0, 160),
      avatar: `https://loremflickr.com/320/240?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/480/180/nature/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
