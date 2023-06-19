'use strict'

const { likeArr } = require('../helpers/seed-helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE role="user";', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;', { type: queryInterface.sequelize.QueryTypes.SELECT })

    const likeNumber = Math.floor(tweets.length / 3)
    const arr = likeArr(users, tweets, likeNumber)

    await queryInterface.bulkInsert(
      'Likes',
      Array.from({ length: likeNumber * users.length }, (_, i) => ({
        user_id: arr[i].userId,
        tweet_id: arr[i].tweetId,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
