'use strict'
const userIdsQueryString = "SELECT `id` FROM `Users` WHERE role='user';"
const tweetIdsQueryString = 'SELECT `id` FROM `Tweets`;'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [userIds, tweetIds] = await Promise.all([
      queryInterface.sequelize.query(
        userIdsQueryString,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ), queryInterface.sequelize.query(
        tweetIdsQueryString,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ])
    const combinationArray = []
    for (const u of userIds) {
      for (const t of tweetIds) {
        combinationArray.push([u.id, t.id])
      }
    }
    return queryInterface.bulkInsert('Likes',
      Array.from({ length: tweetIds.length }, () => {
        const index = Math.floor(Math.random() * combinationArray.length)
        const [UserId, TweetId] = combinationArray.splice(index, 1)[0]
        return {
          UserId,
          TweetId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      , {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
