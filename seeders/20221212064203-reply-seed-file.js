'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE role = 'user';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await Promise.all(Array.from({ length: 3 }, (_, i) =>
      queryInterface.bulkInsert('Replies',
        tweets.map(tweet => {
          return {
            user_id: users[Math.floor(Math.random() * users.length)].id,
            tweet_id: tweet.id,
            comment: faker.lorem.words(),
            created_at: new Date(),
            updated_at: new Date()
          }
        }))))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
