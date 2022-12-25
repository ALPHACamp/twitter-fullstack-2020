'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    return queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((d, i) => ({
        user_id: users[(i % 5)].id,
        tweet_id: tweets[Math.floor(i / 3)].id,
        comment: faker.lorem.sentences(3),
        created_at: new Date(),
        updated_at: new Date()
      })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Replies', null, {})
  }
}
