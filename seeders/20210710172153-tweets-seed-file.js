'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',

      Array.from({ length: 10 }).map((d, i) =>
      ({
        UserId: 1,
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ),
      Array.from({ length: 10 }).map((d, i) =>
      ({
        UserId: 2,
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ),
      Array.from({ length: 10 }).map((d, i) =>
      ({
        UserId: 3,
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ),
      Array.from({ length: 10 }).map((d, i) =>
      ({
        UserId: 4,
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ),
      Array.from({ length: 10 }).map((d, i) =>
      ({
        UserId: 5,
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ),
      Array.from({ length: 10 }).map((d, i) =>
      ({
        UserId: 6,
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ),
      {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
