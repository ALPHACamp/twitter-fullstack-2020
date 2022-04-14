'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role IS null;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const replies = []
    tweets.forEach(tweet => {
      for (let i = 0; i < 3; i++) {
        replies.push({
          userId: users[Math.floor(Math.random() * users.length)].id,
          tweetId: tweet.id,
          comment: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('Replies', replies)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
