'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Followships', [{
      id: 1,
      followerId: 2,
      followingId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      followerId: 3,
      followingId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      followerId: 4,
      followingId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 4,
      followerId: 5,
      followingId: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 5,
      followerId: 6,
      followingId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 6,
      followerId: 2,
      followingId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 7,
      followerId: 2,
      followingId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 8,
      followerId: 2,
      followingId: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 9,
      followerId: 3,
      followingId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 10,
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
