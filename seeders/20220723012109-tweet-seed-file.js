'use strict'
const faker = require('faker')
const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 查詢資料庫中所有的 user
    const usersArray = await User.findAll({ raw: true, nester: true })

    let tweetArray = []
    // 製做每位 user 的假 tweet
    usersArray.forEach(user => {
      tweetArray = tweetArray.concat(
        // 每位 user 的假資料為10篇 tweet
        Array.from({ length: 10 }, () => ({
          description: faker.lorem.text().substring(0, 30),
          user_id: user.id,
          created_at: new Date(),
          updated_at: new Date()
        }))
      )
    })

    await queryInterface.bulkInsert('Tweets', tweetArray)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
