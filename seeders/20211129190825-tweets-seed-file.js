'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((d, i) => ({
        id: i * 10 + 1,
        UserId: Math.floor((i / 10)) * 10 + 11,
        description: faker.lorem.text().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Tweets', null, {})
  }
};
