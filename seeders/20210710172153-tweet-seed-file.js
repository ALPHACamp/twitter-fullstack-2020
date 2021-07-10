'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 20 }).map((d, i) =>
      ({
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async  (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
