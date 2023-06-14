'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')
const { generateLimitedParagraph } = require('../helpers/seed-helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const fakeUsers = []
    const admin = {
      account: 'root',
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      cover: `https://loremflickr.com/320/240/background/?random=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/avatar,person/?random=${Math.random() * 100}`,
      introduction: generateLimitedParagraph(160),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    fakeUsers.push(admin)

    for (let i = 1; i <= 12; i++) {
      const user = {
        account: `user${i}`,
        name: faker.lorem.word(50),
        email: `user${i}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        cover: `https://loremflickr.com/320/240/background/?random=${Math.random() * 100}`,
        avatar: `https://loremflickr.com/320/240/avatar,person/?random=${Math.random() * 100}`,
        introduction: generateLimitedParagraph(160),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      fakeUsers.push(user)
    }

    await queryInterface.bulkInsert('Users', fakeUsers, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
