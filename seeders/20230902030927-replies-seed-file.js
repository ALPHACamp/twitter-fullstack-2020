'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const [users, tweets] = await Promise.all([
        queryInterface.sequelize.query(
          "SELECT id FROM Users WHERE `role` = 'user';",
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        ),
        queryInterface.sequelize.query(
          'SELECT id FROM Tweets;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        )
      ])

      const delayInMinutes = 5
      const replyCount = 150
      const replies = []

      for (let i = 0; i < replyCount; i++) {
        const userIndex = i % 5
        const tweetIndex = parseInt(i / 3)
        const createdAt = new Date(Date.now() - i * delayInMinutes * 60000).toISOString().substring(0, 16)

        replies.push({
          User_id: users[userIndex].id,
          Tweet_id: tweets[tweetIndex].id,
          comment: faker.lorem.text().substring(0, 80),
          created_at: createdAt,
          updated_at: createdAt
        })
      }

      await queryInterface.bulkInsert('Replies', replies, {})
      console.log('Replies table seeding completed successfully.')
    } catch (error) {
      console.error('Error seeding replies.', error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Replies', {})
      console.log('Replies table reverted successfully.')
    } catch (error) {
      console.error('Error reverting Replies table.', error)
    }
  }
}