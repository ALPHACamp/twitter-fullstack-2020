'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
    
      Array.from({ length: 10 }).map((d, i) =>
      ({
        userId: 1,
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ),
      Array.from({ length: 10 }).map((d, i) =>
      ({
        userId: 2,
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ),
      Array.from({ length: 10 }).map((d, i) =>
      ({
        userId: 3,
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ),
      Array.from({ length: 10 }).map((d, i) =>
      ({
        userId: 4,
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ),
      Array.from({ length: 10 }).map((d, i) =>
      ({
        userId: 5,
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ),
      Array.from({ length: 10 }).map((d, i) =>
      ({
        userId: 6,
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ),
       {})
  },

  down: async  (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
