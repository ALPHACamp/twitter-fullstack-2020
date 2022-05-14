'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweetReplies = []

    const storedIndex = []
    function randomIndex () {
      if (storedIndex.length < 3) {
        const index = Math.ceil(Math.random() * (users.length - 1))
        if (storedIndex.some(i => i === index)) return randomIndex()
        storedIndex.push(index)
        return index
      }
      storedIndex.length = 0
      return randomIndex()
    }

    for (let i = 0; i < tweets.length; i++) {
      const result = Array.from({ length: 3 }, () => ({
        UserId: users[randomIndex()].id,
        TweetId: tweets[i].id,
        comment: faker.lorem.text().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      tweetReplies.push(...result)
    }
    await queryInterface.bulkInsert('Replies', tweetReplies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
