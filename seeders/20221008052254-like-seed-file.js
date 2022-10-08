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
    const likeArr = []

    for (let i = 0; i < tweets.length; i++) {
      const randomNumbers = new Set()

      while (randomNumbers.size < 3) {
        randomNumbers.add(Math.ceil(Math.random() * (users.length - 1)))
      }
      const noRepeatedUsers = [...randomNumbers]

      const result = Array.from({ length: 3 }, (_, index) => ({
        user_id: users[noRepeatedUsers[index]].id,
        tweet_id: tweets[i].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
      likeArr.push(...result)
    }
    await queryInterface.bulkInsert('Likes', likeArr, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
