'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 180 }).map((d, i) =>
      ({
        // comment: faker.lorem.text().substring(0, 20),
        comment: faker.lorem.text().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date(),
        tweetId: Math.ceil((i + 1) / 3),
        userId: i + 1 - Math.floor(i / 6) * 6,
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
