'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // random pair of user and tweet, filter out user to itself tweets
    const randomPair = Array.from({ length: 50 })
      .map((d, index) => [
        Math.ceil(Math.random() * 5) * 10 + 1,
        index * 10 + 1
      ])
      .filter((pair, index) => {
        // 依 tweets seed 一人10篇tweet
        // 編號百位數0屬userId 11 的tweet
        // 編號百位數1屬userId 21 的tweet 以此類推
        return Math.floor(pair[0] / 10) - 1 === Math.floor(pair[1] / 100)
      })

    await queryInterface.bulkInsert(
      'Likes',
      randomPair.map((pair, index) => ({
        id: index * 10 + 1,
        UserId: pair[0],
        TweetId: pair[1],
        createdAt: new Date(
          new Date().setDate(new Date().getDate() - 30 + index / 5)
        ),
        updatedAt: new Date(
          new Date().setDate(new Date().getDate() - 30 + index / 5)
        )
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
