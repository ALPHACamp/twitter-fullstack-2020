'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 200 }).map((d, i) => ({
        id: i + 1,
        UserId: Math.floor(Math.random() * 4) + 1,
        TweetId: Math.floor(Math.random() * 50) + 1,
        comment: faker.lorem.text().slice(0, 50),
        createdAt: new Date(),
        updatedAt: new Date()
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};