'use strict';
const faker = require('faker')


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',Array.from({ length: 50 }).map((d, i) => ({
      User_id: [Math.floor(i / 10)],
      description: faker.lorem.text(),
      created_at: new Date(),
      updated_at: new Date()
    })), {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, { truncate: true, restartIdentity: true })
  }
};

