'use strict'
const faker = require('faker')
const { User, Tweet } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({
      attribute: ['id'],
      where: { role: 'user' }
    })
    const tweets = await Tweet.findAll({ attribute: ['id'] })
    const userRandomIndex = Math.floor(Math.random() * users.length)
    const tweetRandomIndex = Math.floor(Math.random() * tweets.length)
    const userId = users[userRandomIndex].id
    const tweetId = tweets[tweetRandomIndex].id
    await queryInterface.bulkInsert('Replies', Array.from({ length: 300 }), () => ({
      comment: faker.lorem.sentence(),
      userId,
      tweetId,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
