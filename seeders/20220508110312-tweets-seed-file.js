'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const usersTweet = []

    for (let i = 1; i < users.length; i++) {
      const result = Array.from({ length: 10 }, () => ({
        UserId: users[i].id,
        description: faker.lorem.text().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      usersTweet.push(...result)
    }
    await queryInterface.bulkInsert('Tweets', usersTweet, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
