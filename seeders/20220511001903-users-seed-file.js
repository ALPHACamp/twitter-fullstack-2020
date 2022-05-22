'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'root',
      account: 'root',
      avatar: `https://loremflickr.com/320/240/people/?lock=${Math.random() * 100}`,
      cover: `https://loremflickr.com/570/200/scene/?lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().slice(0, 160),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user1',
      account: 'user1',
      avatar: `https://loremflickr.com/320/240/people/?lock=${Math.random() * 100}`,
      cover: `https://loremflickr.com/570/200/scene/?lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().slice(0, 160),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user2',
      account: 'user2',
      avatar: `https://loremflickr.com/320/240/people/?lock=${Math.random() * 100}`,
      cover: `https://loremflickr.com/570/200/scene/?lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().slice(0, 160),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user3',
      account: 'user3',
      avatar: `https://loremflickr.com/320/240/people/?lock=${Math.random() * 100}`,
      cover: `https://loremflickr.com/570/200/scene/?lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().slice(0, 160),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user4',
      account: 'user4',
      avatar: `https://loremflickr.com/320/240/people/?lock=${Math.random() * 100}`,
      cover: `https://loremflickr.com/570/200/scene/?lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().slice(0, 160),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user5',
      account: 'user5',
      avatar: `https://loremflickr.com/320/240/people/?lock=${Math.random() * 100}`,
      cover: `https://loremflickr.com/570/200/scene/?lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().slice(0, 160),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
