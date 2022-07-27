'use strict'
const { getNoRepeatRandomIndex } = require('../helpers/seeder-helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Likes',
      // 每位 user 隨機 like 10篇推文，不須排除自己
      users.reduce((acc, cur) => {
        return acc.concat(Array.from(
          getNoRepeatRandomIndex(tweets.length, 10),
          (v, i) => ({
            UserId: cur.id,
            TweetId: tweets[v].id,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ))
      }, []), {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
