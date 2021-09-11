'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 30 }).map((d, i) =>
      ({
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId: Math.floor(Math.random() * 5) + 2,
        TweetID: Math.floor(Math.random() * 50) + 1,
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}