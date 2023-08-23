'use strict'

const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id, role FROM Users',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweetsPerUser = 10
    const tweets = []
    for (const user of users) {
      if (user.role === 'user') {
        for (let i = 0; i < tweetsPerUser; i++) {
          const tweet = {
            user_id: user.id,
            description: faker.lorem.text(2),
            created_at: new Date(),
            updated_at: new Date()
          }
          tweets.push(tweet)
        }
      }
    }
    await queryInterface.bulkInsert('Tweets', tweets, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
