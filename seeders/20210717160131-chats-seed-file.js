'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Chats',
      Array.from({ length: 50 }).map((d, i) => ({
        id: i + 1,
        UserId: (i % 5) + 2,
        channel: 'chat message',
        behavior: 'live-talk',
        message: faker.lorem.text().slice(0, 20),
        createdAt: new Date(),
        updatedAt: new Date
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Chats', null, {})
  }
};
