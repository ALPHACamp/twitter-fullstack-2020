'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE is_admin = false', { type: queryInterface.sequelize.QueryTypes.SELECT })
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
          created_at: new Date(),
          updated_at: new Date(),
          tweet_id: tweet.id,
          user_id: user.id
        })
      })
    })

    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
