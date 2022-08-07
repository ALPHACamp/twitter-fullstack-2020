'use strict'
const faker = require('faker')
const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersIds = await User.findAll({
      where: { role: 'user' },
      attributes: ['id'],
      raw: true
    })
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 100 }).map((_, index) => ({
        user_id: usersIds[~~(index / 10)].id,
        description: faker.lorem.sentences(),
        created_at: faker.date.recent(),
        updated_at: new Date()
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
