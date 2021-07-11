'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const replies = []
    const tweets = Array.from({ length: 50 }).map((d, i) => ({
      id: i + 1
    }))
    const users = Array.from({ length: 5 }).map((d, i) => i + 2)

    tweets.forEach((tweet) => {
      [0, 1, 2].forEach((i) => {
        let userIdRandom = Math.floor(Math.random() * (users.length + 2))
        if (userIdRandom < 2) {
          userIdRandom += 2
        }
        replies.push({
          UserId: userIdRandom,
          content: faker.lorem.word(),
          TweetId: tweet.id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
    })

    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, { truncate: true, restartIdentity: true })
  }
};