'use strict'

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

    for (let i = 0; i < 3; i++) {
      const randomNumbers = new Set()
      // keep adding elements till size of set is equal to n
      while (randomNumbers.size < 3) {
        // Generating random number and adding it
        randomNumbers.add(Math.ceil(Math.random() * (users.length - 1)))
      }
      const noRepeatedUsers = [...randomNumbers]

      const result = Array.from({ length: 3 }, (_, index) => ({
        UserId: users[noRepeatedUsers[index]].id,
        TweetId: tweets[i].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      tweetReplies.push(...result)
    }
    await queryInterface.bulkInsert('Likes', tweetReplies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
