'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 60 }).map((d, i) =>
      ({
        // description: faker.lorem.text().substring(0, 20),
        description: faker.lorem.text().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: Math.ceil((i + 1) / 10),
      }),
      ), {})
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
    await queryInterface.bulkDelete('Tweets', null, {})
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
