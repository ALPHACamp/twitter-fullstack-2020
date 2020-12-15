const faker = require('faker')
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (let x = 0; x < 5; x++) {
      await queryInterface.bulkInsert('Tweets',
        Array.from({ length: 10 }).map((d, i) => ({
          id: `${x * 10 + (i + 1)}`,
          UserId: `${x + 2}`,
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        ))
        , {})
    }
  }
  ,
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
