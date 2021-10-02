'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Followships', Array.from({ length: 4 }).map((d, i) => ({
      id: i * 5 + 5,
      followerId: 5,
      followingId: i * 5 + 10,
      createdAt: new Date(),
      updatedAt: new Date()
    })))
    await queryInterface.bulkInsert('Followships', Array.from({ length: 4 }).map((d, i) => ({
      id: i * 5 + 25,
      followerId: 10,
      followingId: (i * 5 + 15) > 25 ? 5 : i * 5 + 15,
      createdAt: new Date(),
      updatedAt: new Date()
    })))
    await queryInterface.bulkInsert('Followships', Array.from({ length: 2 }).map((d, i) => ({
      id: i * 5 + 45,
      followerId: 15,
      followingId: i * 5 + 20,
      createdAt: new Date(),
      updatedAt: new Date()
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
