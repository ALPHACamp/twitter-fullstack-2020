'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }, (v, i) => {
        return {
          comment: faker.lorem.text(),
          user_id: users[Math.floor(i % users.length)].id,
          tweet_id: tweets[Math.floor(i / 3)].id,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
