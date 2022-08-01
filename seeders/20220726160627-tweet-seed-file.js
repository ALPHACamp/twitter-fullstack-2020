'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE `role` <> "admin";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // 每人10篇推文
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: users.length * 10 }, (_, i) => ({
        description: faker.lorem.sentences(),
        UserId: users[i % users.length].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })), {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
