'use strict'

const faker = require('faker')
const { randomNumber, userIndex } = require('../helpers/seed-helper')

const repliesNumber = 3

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      // 限制只有user
      'SELECT id FROM Users WHERE role = "user";',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;', { type: queryInterface.sequelize.QueryTypes.SELECT })

    const arr = Array.from(Array(repliesNumber * tweets.length).keys())

    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: repliesNumber * tweets.length }, (_, i) => ({
        user_id: users[userIndex(i, users.length)].id,
        tweet_id: tweets[randomNumber(arr, repliesNumber)].id,
        comment: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
