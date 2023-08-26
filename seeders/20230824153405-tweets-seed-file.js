'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const users = await queryInterface.sequelize.query(
        'SELECT id FROM Users WHERE role = "user"',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
      const tweets = []

      for (const user of users) {
        for (let i = 0; i < 10; i++) {
          tweets.push({
            description: faker.lorem.text().substring(0, 50),
            user_id: user.id,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      }
      await queryInterface.bulkInsert('Tweets', tweets, {})
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
