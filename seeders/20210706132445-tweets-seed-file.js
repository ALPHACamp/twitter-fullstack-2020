'use strict';

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((d, i) => ({
        id: i + 1,
        UserId: (i % 5) + 2,
        // UserId: Math.floor(Math.random() * 4) + 1,
        description: faker.lorem.text().slice(0, 50),
        createdAt: new Date(),
        updatedAt: new Date
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};