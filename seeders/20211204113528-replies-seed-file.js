'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Replies',
      Array.from({ length: 10 }).map((item, index) => ({
        comment: faker.lorem.sentence(),
        UserId: Math.floor(Math.random() * 3) + 1,
        TweetId: Math.floor(Math.random() * 6) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Replies', null, {})
  }
};
