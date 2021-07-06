'use strict';

const mappingTable = [
  [1, 2],
  [1, 3],
  [1, 4],
  // [2,1],
  [2, 3],
  // [2,4],
  [3, 1],
  [3, 2],
  [3, 4],
  // [4,1],
  [4, 2],
  // [4,3]
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Followships', [{
      followerId: 1,
      followingId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: 1,
      followingId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: 1,
      followingId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: 2,
      followingId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: 2,
      followingId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: 3,
      followingId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
