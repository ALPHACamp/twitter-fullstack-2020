'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((d, i) => ({
        id: i + 1,
        UserId: (i % 3) + 2,
        TweetId: (i % 50) + 1,
        comment: faker.lorem.text().slice(0, 50),
        createdAt: new Date(),
        updatedAt: new Date()
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};