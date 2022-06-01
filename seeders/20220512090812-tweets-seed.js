'use strict'
const faker = require('faker')
const queryString = "SELECT `id` FROM `Users` WHERE role='user';"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userIds = await queryInterface.sequelize.query(
      queryString,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    return queryInterface.bulkInsert('Tweets',
      Array.from({ length: userIds.length * 10 }, (element, index) => ({
        description: faker.lorem.text().slice(0, 139),
        UserId: userIds[index % userIds.length].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      , {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
