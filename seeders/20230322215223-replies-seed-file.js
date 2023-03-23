'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => { 
    await queryInterface.bulkInsert('Replies', Array.from({ length: 50 }).map((d, i) => ({
      UserId: [Math.floor(i / 10)],
      TweetId: [Math.floor(i / 10)],
      comment: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, { truncate: true, restartIdentity: true })
  }
};
