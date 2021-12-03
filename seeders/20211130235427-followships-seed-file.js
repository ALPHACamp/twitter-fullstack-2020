'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    await queryInterface.bulkInsert('Followships', 
      Array.from({ length: 5 }).map((d, i) =>
      (
        {
          id: i + 1,
          followerId: Math.floor(Math.random()*(6-2+1)+1),
          followingId: Math.floor(Math.random()*(6-2+1)+1),
          createdAt: faker.date.recent(),
          updatedAt: new Date()
        }
      )
    ), {})
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
