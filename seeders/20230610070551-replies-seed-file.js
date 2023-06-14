'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE role = "user"', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets', { type: queryInterface.sequelize.QueryTypes.SELECT })

    const replies = []

    tweets.forEach(tweet => {
      const randomUsers = []

      for (let i = 0; i < 3; i++) {
        randomUsers.push(users[Math.floor(Math.random() * users.length)])
      }
      randomUsers.forEach(user => {
        replies.push({
          comment: faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date(),
          tweetId: tweet.id,
          userId: user.id
        })
      })
    })

    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
