'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先撈出 users (不含 admin)，結果是一個 array
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const numberOfTweets = 10 // 為每個使用者生成 10 篇 tweet

    const tweets = []

    for (let i = 0; i < users.length; i++) {
      for (let x = 0; x < numberOfTweets; x++) {
        tweets.push({
          UserId: users[i].id,
          description: faker.lorem.words(130),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('Tweets', tweets, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', null, {})
  }
}
