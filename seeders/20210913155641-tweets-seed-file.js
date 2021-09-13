'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets', Array.from({ length: 50 }).map((d, i) => ({
      id: i * 5 + 5,
      UserId: i < 10 ? 5 : i < 20 ? 10 : i < 30 ? 15 : i < 40 ? 20 : i < 50 ? 25 : null,
      description: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
