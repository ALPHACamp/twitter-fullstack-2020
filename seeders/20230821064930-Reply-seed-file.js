'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE email !="root@example.com"',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT })

    const replyData = []

    tweets.map(tweet => {
      for (let i = 0; i < 3; i++) {
        const reply = {
          TweetId: tweet.id,
          UserId: users[Math.floor(Math.random() * users.length)].id,
          comment: faker.lorem.text().substring(0, 45),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        replyData.push(reply)
      }
    })

    await queryInterface.bulkInsert(
      'Replies',
      replyData
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
