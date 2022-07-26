'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_TWEET_WORDS = 100 // 推文字數上限140字，預設100字
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // 每人10篇推文
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: users.length * 10 }, (_, i) => ({
        description: faker.lorem.words(DEFAULT_TWEET_WORDS),
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
