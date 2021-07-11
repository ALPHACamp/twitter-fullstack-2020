'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: 20 }).map((d, i) =>
      ({
        tweetId: Math.floor(Math.random() * 10) + 1,
        userId: Math.floor(Math.random() * 10) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
