'use strict';
const faker = require('faker')
const { Tweet } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 2 }).map((d, i) => ({
        UserId: i + 1,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 10 }).map((d, i) => ({
        UserId: i + 3,
        TweetId: 7,
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets')
    await queryInterface.bulkDelete('Replies')
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
