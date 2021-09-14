'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 10 }).map((d, i) =>
      ({
        UserId: Math.floor(Math.random() * 5) + 2,
        description: faker.lorem.paragraph(faker.random.number({ min: 1, max: 3 })),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
