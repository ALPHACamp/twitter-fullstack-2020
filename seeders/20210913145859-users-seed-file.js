'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      Array.from({ length: 5 }).map((d, i) => ({
        id: i * 5 + 5,
        account: 'user' + (i + 1),
        email: faker.internet.email(),
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: faker.name.findName(),
        avatar: `https://loremflickr.com/320/240/selfie?lock=${i}`,
        introduction: faker.lorem.text().substring(0, 160),
        role: false,
        cover: `https://loremflickr.com/400/300/landscape?lock=${i}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
