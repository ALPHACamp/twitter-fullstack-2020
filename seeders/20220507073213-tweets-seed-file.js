'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }).map((_, i) => ({
        id: i + 1,
        description: faker.lorem.text(),
        UserId: (i % 5) + 2, // 由user1開始
        createdAt: faker.date.recent(), // 時間打散
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
