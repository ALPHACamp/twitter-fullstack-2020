'use strict';
const faker = require('faker')

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 20 }).map((d, i) =>
      ({
        tweetId: Math.floor(Math.random() * 10) + 1,
        userId: Math.floor(Math.random() * 10) + 1,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
