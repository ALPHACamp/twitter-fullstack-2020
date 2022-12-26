'use strict'
const db = require('../models')
const User = db.User
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' } })

    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 60 }).map((d, i) => ({
        UserId: users[Math.floor(i / 10)].id,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })),{}
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, { truncate: true })
  }
}
