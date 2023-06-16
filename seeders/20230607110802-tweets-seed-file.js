'use strict'

const faker = require('faker')
const { randomNumber, randomDate } = require('../helpers/seed-helper')

const tweetsNumber = 10
const startDate = new Date('2023-01-01')
const endDate = new Date()

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      // 限制只有user
      'SELECT id FROM Users WHERE role="user";',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const arr = Array.from(Array(users.length * tweetsNumber).keys())
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: users.length * tweetsNumber }, () => ({
        user_id: users[randomNumber(arr, tweetsNumber)].id,
        description: faker.lorem.text(),
        created_at: randomDate(startDate, endDate),
        updated_at: randomDate(startDate, endDate)
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
