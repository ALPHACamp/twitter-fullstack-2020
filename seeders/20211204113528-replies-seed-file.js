'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((item, i) => ({
        comment: faker.lorem.sentence(),
        UserId: i % 5 + 2,
        TweetId: Math.floor(i / 3) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Replies', null, {})
  }
};
