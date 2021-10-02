'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets', Array.from({ length: 50 }).map((d, i) => ({
      id: i * 5 + 5,
      UserId: (i % 5) * 5 + 5,
      description: faker.lorem.text().substring(0, 140),
      createdAt: new Date(),
      updatedAt: new Date()
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
