'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: 50 }).map((d, i) =>
      ({
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId: Math.floor(Math.random() * 5) + 2,
        TweetId: Math.floor(Math.random() * 50) + 1,
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}