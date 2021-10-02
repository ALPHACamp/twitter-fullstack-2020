'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes', Array.from({length: 50}).map((d, i) => ({
      id: i * 5 + 5,
      UserId: (Math.floor(Math.random() * 5) + 1) * 5,
      TweetId: i * 5 + 5,
      createdAt: new Date(),
      updatedAt: new Date()
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
