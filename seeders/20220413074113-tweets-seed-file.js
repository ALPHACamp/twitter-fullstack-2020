'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role IS null;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = []
    users.forEach(user => {
      for (let i = 0; i < 10; i++) {
        tweets.push({
          userId: user.id,
          content: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('Tweets', tweets)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
