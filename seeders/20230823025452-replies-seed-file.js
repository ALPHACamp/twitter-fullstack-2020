'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role='user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: tweets.length * 3 }, (_, i) => ({
        comment: faker.lorem.text().substring(0, 50),
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId: users[Math.floor(Math.random() * users.length)].id,
        TweetId: tweets[i % tweets.length].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
