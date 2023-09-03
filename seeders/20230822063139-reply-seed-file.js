'use strict'

/** @type {import('sequelize-cli').Migration} */
const faker = require('faker')

const REPLY_AMOUNT_FOR_EACH_TWEET = 3
const LIMIT_LINE = 1
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE NOT role='admin'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    for (const tweet of tweets) {
      await queryInterface.bulkInsert('Replies',
        Array.from({ length: REPLY_AMOUNT_FOR_EACH_TWEET }, () => ({
          tweet_id: tweet.id,
          user_id: users[Math.floor(Math.random() * users.length)].id,
          comment: faker.lorem.lines(LIMIT_LINE),
          created_at: new Date(),
          updated_at: new Date()
        }))
      )
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Replies', {})
  }
}
