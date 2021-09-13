'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies', Array.from({ length: 150 }).map((d, i) => ({
      id: i * 5 + 5,
      UserId: (i % 5) * 5 + 5,
      TweetId: (i % 50) * 5 + 5,
      comment: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
