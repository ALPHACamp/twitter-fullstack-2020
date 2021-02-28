'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((_, i) => ({
        id: i * 10 + 1,
        UserId: Math.floor(Math.random() * 5) * 10 + 1,
        TweetId: (i % 50) * 10 + 1,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, { truncate: true })
  }
};
