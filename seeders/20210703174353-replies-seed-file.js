'use strict';
const faker = require('faker')
const usage = require('../config/usage')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 })
        .map((item, index) =>
        ({
          id: index * 10 + 1,
          comment: usage.stringLimit(faker.lorem.text(), 140),
          UserId: (Math.floor(Math.random() * 5) + 1) * 10 + 1,
          TweetId: (index % 50) * 10 + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
