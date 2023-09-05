'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const delayInMinutes = 5
      const users = await queryInterface.sequelize.query(
        'SELECT id FROM Users WHERE role = "user";',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )

      await queryInterface.bulkDelete('Tweets',
        Array.from({ length: users.length * 10 }, (_, i) => {
          const createdAt = new Date(Date.now() - i * delayInMinutes * 60000).toISOString().substring(0, 16)
          const updatedAt = createdAt

          return {
            User_id: users[i % users.length].id,
            description: faker.lorem.text().substring(1, 140),
            created_at: createdAt,
            updated_at: updatedAt
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
