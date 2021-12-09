'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((d, i) =>
      ({
        id: i + 1,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId: i % 5 + 2
      })

      ), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', null, {})
  }
};
