'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const users = await queryInterface.sequelize.query(
        "SELECT id FROM Users WHERE `role` = 'user';",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )

      const delayInMinutes = 10
      const tweetsPerUser = 10

      await queryInterface.bulkInsert('Tweets',
        Array.from({ length: users.length * tweetsPerUser }, (_, i) => {
          const createdAt = new Date(Date.now() - i * delayInMinutes * 60000).toISOString().substring(0, 16)
          const maxTextLength = 140

          return {
            User_id: users[i % users.length].id,
            description: faker.lorem.text().substring(0, maxTextLength),
            created_at: createdAt,
            updated_at: createdAt
          }
        }), {}
      )
      console.log('Tweets table seeding completed successfully.')
    } catch (error) {
      console.error('Error seeding Tweets.', error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Tweets', {})
      console.log('Tweets table reverted successfully.')
    } catch (error) {
      console.error('Error reverting Tweets table.', error)
    }
  }
}
