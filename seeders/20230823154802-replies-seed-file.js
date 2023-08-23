'use strict'

const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id, role FROM Users WHERE role = "user"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const replyPerTweet = 3
    const replies = []
    for (const tweet of tweets) {
      for (let i = 0; i < replyPerTweet; i++) {
        const reply = {
          user_id: users[Math.floor(Math.random() * users.length)].id,
          tweet_id: tweet.id,
          comment: faker.lorem.text(2),
          created_at: new Date(),
          updated_at: new Date()
        }
        replies.push(reply)
      }
    }
    await queryInterface.bulkInsert('Replies', replies, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
