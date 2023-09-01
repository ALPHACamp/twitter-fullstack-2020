'use strict'

/** @type {import('sequelize-cli').Migration} */
const faker = require('faker')

const TWEET_AMOUNT_FOR_EACH_USER = 10
const LIMIT_LINE = 1
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE NOT role='admin'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    for (const user of users) {
      await queryInterface.bulkInsert('Tweets',
        Array.from({ length: TWEET_AMOUNT_FOR_EACH_USER }, () => ({
          user_id: user.id,
          description: faker.lorem.lines(LIMIT_LINE),
          created_at: new Date(),
          updated_at: new Date()
        }))
      )
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
