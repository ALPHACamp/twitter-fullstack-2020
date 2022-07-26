'use strict'
const faker = require('faker')
const { Tweet } = require('models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await Tweet.findAll({
      attribute: ['id'],
      raw: true,
      nest: true
    })
    const randomIndex = Math.floor(Math.random() * tweets.length)
    const tweetId = tweets[randomIndex].id
    const userId = tweets[randomIndex].userId
    await queryInterface.bulkInsert('Reply', Array.from({ length: 300 }), () => ({
      comment: faker.lorem.sentence(),
      user_id: userId,
      tweet_id: tweetId,
      created_at: new Date(),
      updated_at: new Date()
    }))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Reply', null, {})
  }
}
