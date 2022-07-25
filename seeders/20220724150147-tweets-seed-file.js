'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    for (let i = 1; i <= 4; i++) {
      await queryInterface.bulkInsert(
        'Tweets', {
          description: faker.lorem.paragraphs(),
          created_at: new Date(),
          updated_at: new Date(),
          user_id: users[i].id
        }, {})
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
