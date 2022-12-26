'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE role = 'user';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await Promise.all(Array.from({ length: 10 }, (_, i) =>
      queryInterface.bulkInsert('Tweets',
        users.map(user => {
          return {
            user_id: user.id,
            description: faker.lorem.sentences(3),
            created_at: new Date(),
            updated_at: new Date()
          }
        }))))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
