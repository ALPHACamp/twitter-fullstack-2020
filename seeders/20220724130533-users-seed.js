'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = Array.from({ length: 5 }).map((d, i) => ({
      email: `user${i + 1}@example.com`,
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: `user${i + 1}`,
      avatar: `https://loremflickr.com/150/150/avatar/?lock=${i}`,
      cover: `https://loremflickr.com/700/250/landscape/?lock=${i}`,
      account: `user${i + 1}`,
      introduction: faker.lorem.sentences(2),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }))
    users.push({
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'root',
      avatar: 'https://loremflickr.com/150/150/avatar/?random=1',
      cover: `https://loremflickr.com/700/250/landscape/?random=1`,
      account: 'root',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    })
    await queryInterface.bulkInsert('Users', users, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
