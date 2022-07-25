'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    for (let i = 0; i <= 9; i++) {
      await queryInterface.bulkInsert('Tweets',
        Array.from({ length: users.length - 1 }, (_, i) => {
          return {
            user_id: users[i + 1].id,
            description: faker.lorem.paragraphs(),
            created_at: new Date(),
            updated_at: new Date()
          }
        })
      )
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
