'use strict'
const faker = require('faker')
const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findAll({ where: { role: 'user' }, raw: true })
    await queryInterface.bulkInsert('Tweets', Array.from({ length: 200 }).map((_, i) => ({
      user_id: user[Math.floor(i / 10)].id,
      description: faker.lorem.sentences(2),
      created_at: new Date(),
      updated_at: new Date()
    })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
