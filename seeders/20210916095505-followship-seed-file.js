'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: 10 }).map((d, i) =>
      ({
        createdAt: new Date(),
        updatedAt: new Date(),
        followerId: Math.floor(Math.random() * 5) + 2,
        followingId: Math.floor(Math.random() * 5) + 2
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}