'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', Array.from({length: 4}).map((d, i) => ({
      id: i * 5 + 5,
      account: faker.finance.accountName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: false,
      name: faker.name.findName(),
      createdAt: new Date(),
      updatedAt: new Date()
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
