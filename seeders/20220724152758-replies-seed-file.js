'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    for (let i = 0; i < 3; i++) {
      await queryInterface.bulkInsert('Replies',
        tweets.map(tweet => {
          return {
            tweet_id: tweet.id,
            user_id: users[Math.floor(Math.random() * (users.length - 1)) + 1].id,
            comment: faker.lorem.sentence(),
            created_at: new Date(),
            updated_at: new Date()
          }
        })
      )
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
