'use strict';

const faker = require('faker')
const db = require('../models')
const User = db.User




module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll()

    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 30 }).map((d, i) =>
      ({
        UserId: users[Math.floor(Math.random() * users.length)].id,
        description: faker.lorem.text().substring(0, 130),
        createdAt: new Date(new Date().getTime() - Math.floor(Math.floor(Math.random() * 600000000))),
        updatedAt: new Date()
      })
      ), {})

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
