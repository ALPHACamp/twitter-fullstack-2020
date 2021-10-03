'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((d, i) =>
      ({
        // comment: faker.lorem.text().substring(0, 20),
        comment: faker.lorem.text().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date(),
        tweetId: Math.ceil((i + 1) / 5),
        userId: i + 2 - Math.floor(i / 5) * 5,
      }),
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
