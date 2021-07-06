'use strict';

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
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
