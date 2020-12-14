'use strict';
const { fake } = require('faker');
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(Array.from({ length: 5 }).map((d, i) => (
      queryInterface.bulkInsert('Tweets',
        Array.from({ length: 10 }).map((currentValue, j) => ({
          userId: i + 1,
          description: faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {})
    )))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', null, {})
  }
};
