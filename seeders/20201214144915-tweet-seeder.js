'use strict';
const { fake } = require('faker');
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(Array.from({ length: 5 }).map((d, i) => (
      queryInterface.bulkInsert('Tweets',
        Array.from({ length: 10 }).map((currentValue, j) => ({
          id: i * 10 + j + 1,
          userId: i + 2,
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
