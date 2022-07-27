'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // 每篇推文隨機3個人留言
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: tweets.length * 3 }, (_, i) => ({
        comment: faker.lorem.text(),
        UserId: users[Math.floor(Math.random() * users.length)].id,
        TweetId: tweets[i % tweets.length].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })), {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
