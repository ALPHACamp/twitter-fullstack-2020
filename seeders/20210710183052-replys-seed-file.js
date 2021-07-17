'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 180 }).map((d, i) =>
      ({
        TweetId: Math.floor(Math.random() * 180) + 1,
        UserId: Math.floor(Math.random() * 6) + 1,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
