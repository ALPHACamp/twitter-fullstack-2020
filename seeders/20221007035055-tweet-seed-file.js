'use strict'
const faker = require('faker')
const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Tweets', Array.from({ length: 30 }).map((_, i) => ({
      user_id: user[Math.floor(Math.random() * user.length)].id,
      description: faker.lorem.sentences(1),
      created_at: new Date(),
      updated_at: new Date()
    })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
