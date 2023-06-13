'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')
const { generateLimitedParagraph } = require('../helpers/seed-helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      cover: '/images/users/cover.png',
      avatar: faker.image.avatar(),
      introduction: generateLimitedParagraph(160),
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user1',
      name: faker.lorem.word(50),
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      cover: '/images/users/cover.png',
      avatar: faker.image.avatar(),
      introduction: generateLimitedParagraph(160),
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user2',
      name: faker.lorem.word(50),
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      cover: '/images/users/cover.png',
      avatar: faker.image.avatar(),
      introduction: generateLimitedParagraph(160),
      created_at: new Date(),
      updated_at: new Date()

    }, {
      account: 'user3',
      name: faker.lorem.word(50),
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      cover: '/images/users/cover.png',
      avatar: faker.image.avatar(),
      introduction: generateLimitedParagraph(160),
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user4',
      name: faker.lorem.word(50),
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      cover: '/images/users/cover.png',
      avatar: faker.image.avatar(),
      introduction: generateLimitedParagraph(160),
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
