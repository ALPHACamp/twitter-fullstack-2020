'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((d, i) => ({
        id: i * 10 + 1,
        UserId: i % 5 + 11,
        TweetId: Math.floor((i / 3)) * 10 + 1,
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Replies', null, {})
  }
};
