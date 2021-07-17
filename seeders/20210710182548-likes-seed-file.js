'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: 20 }).map((d, i) =>
      ({
        TweetId: Math.floor(Math.random() * 180) + 1,
        UserId: Math.floor(Math.random() * 6) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
