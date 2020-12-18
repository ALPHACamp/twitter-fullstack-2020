'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 15 }).map((d, i) =>
        ({
          id: i * 10 + 1,
          followerId: Math.floor(i / 3) * 10 + 11,
          followingId: Math.floor(i / 3) * 10 + 11 + (i - Math.floor(i / 3)*3 + 1) * 10 > 51 ? Math.floor(i / 3) * 10 + 11 + (i - Math.floor(i / 3)*3 + 1) * 10 - 50: Math.floor(i / 3) * 10 + 11 + (i - Math.floor(i / 3)*3 + 1) * 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {})
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkDelete('Followships', null, {})
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
};
