'use strict';
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 10 }).map((d, i) => ({
        id: i + 1,
        UserId: 2,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {}
    );
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 10 }).map((d, i) => ({
        id: (i + 10) * 2 + 1,
        UserId: 3,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {}
    );
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 10 }).map((d, i) => ({
        id: (i + 20) * 2 + 1,
        UserId: 4,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {}
    );
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 10 }).map((d, i) => ({
        id: (i + 30) * 2 + 1,
        UserId: 5,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {}
    );
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 10 }).map((d, i) => ({
        id: (i + 40) * 2 + 1,
        UserId: 6,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {});
  },
};
