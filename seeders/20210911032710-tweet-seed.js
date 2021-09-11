'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets', 
    Array.from({ length: 10 }).map((d, i) => 
    ({
      UserId: Math.floor(Math.random() * 4),
      content: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
