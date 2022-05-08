'use strict'

const faker = require('faker')
const { Tweet, User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userData = await User.findAll({
      raw: true,
      nest: true,
      where: { role: false },
      attributes: ['id']
    })
    const tweetData = await Tweet.findAll({
      raw: true,
      nest: true,
      attributes: ['id']
    })

    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 150 }).map((_, i) => ({
        id: i + 1,
        UserId: userData[Math.floor(Math.random() * userData.length)].id,
        TweetId: tweetData[Math.floor(i / 3)].id,
        comment: faker.lorem.text(),
        createdAt: faker.date.recent(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
