'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Followships', [{
      followerId: 2,
      followingId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: 3,
      followingId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: 4,
      followingId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: 5,
      followingId: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: 6,
      followingId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: 2,
      followingId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: 2,
      followingId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: 2,
      followingId: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: 3,
      followingId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: 3,
      followingId: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
