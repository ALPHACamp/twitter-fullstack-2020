'use strict'
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' } })
    const tweets = await Tweet.findAll()

    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 180 }).map((d, i) => ({
        UserId: users[Math.floor(Math.random() * users.length)].id,
        TweetId: tweets[Math.floor(i / 3)].id,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, { truncate: true })
  }
}
