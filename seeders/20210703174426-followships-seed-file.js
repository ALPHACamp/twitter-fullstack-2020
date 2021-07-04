'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 5 })
        .map((item, index) =>
        ({
          id: index * 10 + 1,
          followerId: index === 4 ? 21 : 11,
          followingId: index === 4 ? 11 : (index + 2) * 10 + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
