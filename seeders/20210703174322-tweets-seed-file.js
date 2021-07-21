'use strict';
const faker = require('faker')
const usage = require('../config/usage')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 })
        .map((item, index) =>
        ({
          id: index * 10 + 1,
          description: usage.stringLimit(faker.lorem.text(), 140),
          UserId: ((index % 5) + 1) * 10 + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
