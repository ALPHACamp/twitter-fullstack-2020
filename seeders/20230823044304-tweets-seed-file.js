'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweetSeederData = []
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE account <> \'root\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    users.forEach(user => {
      tweetSeederData.push(...Array.from({ length: 10 }, () => ({
        User_id: user.id,
        description: faker.lorem.text().substring(0, 140),
        created_at: new Date(),
        updated_at: new Date()
      })))
    })
    await queryInterface.bulkInsert('Tweets', tweetSeederData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
