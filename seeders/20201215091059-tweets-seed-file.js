'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((d, i) =>
          ({
            id: i * 10 + 1,
            UserId: Math.floor(i / 10) * 10 + 11,
            description: faker.lorem.text(),
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        ), {})
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkDelete('Tweets', null, {})
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
};
