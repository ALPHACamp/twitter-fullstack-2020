'use strict';
const faker = require('faker')
const randomChoose = require('../shuffle')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 5 }, () => {
        const ranNum = randomChoose(users.length, 1)
        return {
          description: faker.lorem.text().substring(0, 140),
          UserId: users[ranNum[0]].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
      ))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
