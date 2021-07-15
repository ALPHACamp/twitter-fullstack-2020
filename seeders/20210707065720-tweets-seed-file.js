'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets', Array.from({ length: 50 }).map((d, i) => ({
      UserId: Math.floor(i / 10) + 2,
      description: faker.lorem.text(),
      replyCount: 3,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, { truncate: true, restartIdentity: true })
  }
};
