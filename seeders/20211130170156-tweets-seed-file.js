'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((d, index) => ({
        id: index * 10 + 1,
        UserId: Math.floor((index + 10) / 10) * 10 + 1,
        description: faker.lorem.text().substring(0, 140),
        createdAt: new Date(new Date().setDate(new Date().getDate() - 230 + index)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 230 + index))
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};

