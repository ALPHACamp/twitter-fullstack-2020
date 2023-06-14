'use strict'
const { generateLimitedParagraph } = require('../helpers/seed-helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE role = "user"', { type: queryInterface.sequelize.QueryTypes.SELECT })

    const tweets = []

    users.forEach(user => {
      for (let i = 0; i < 10; i++) {
        tweets.push({
          description: generateLimitedParagraph(140),
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id
        })
      }
    })

    await queryInterface.bulkInsert('Tweets', tweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
