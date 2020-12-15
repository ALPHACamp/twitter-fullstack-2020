'use strict';
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(Array.from({length: 3}).map((currentValue, j) => {
      queryInterface.bulkInsert('Replies', Array.from({ length: 50 }).map((d, index) => ({
        TweetId: index + 1,
        UserId: Math.floor(Math.random() * 5) + 1,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {})
    }))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Replies', null, {})
  }
};
