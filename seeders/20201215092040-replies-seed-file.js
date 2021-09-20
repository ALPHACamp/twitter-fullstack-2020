'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((d, i) =>
        ({
          id: i * 10 + 1,
          UserId: (Math.floor(Math.random() * 5) + 1) * 10 + 1,
          TweetId: Math.floor(i / 3) * 10 + 1,
          comment: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {})
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkDelete('Replies', null, {})
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
};
