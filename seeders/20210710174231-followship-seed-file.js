'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 20 }).map((d, i) =>
      ({
        followerId: Math.floor(Math.random() * 6) + 1,
        followingId: Math.floor(Math.random() * 6) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
