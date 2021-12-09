'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 150 }).map((d, index) => ({
        id: index * 10 + 1,
        UserId: (index % 5) * 10 + 11,
        TweetId: Math.floor(index / 3) * 10 + 1,
        comment: faker.lorem.sentences().substring(0, 140),
        createdAt: new Date(
          new Date().setDate(new Date().getDate() - 180 + index)
        ),
        updatedAt: new Date(
          new Date().setDate(new Date().getDate() - 180 + index)
        )
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
