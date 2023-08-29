'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE email !="root@example.com"', { type: queryInterface.sequelize.QueryTypes.SELECT })

    const tweetData = []

    users.map(user => {
      for (let i = 0; i < 10; i++) {
        const tweet = {
          UserId: user.id,
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        tweetData.push(tweet)
      }
    })

    await queryInterface.bulkInsert(
      'Tweets',
      tweetData
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
