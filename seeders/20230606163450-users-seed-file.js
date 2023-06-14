'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = []

    // admin
    const admin = {
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      account: 'root',
      name: 'root',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }
    users.push(admin)

    // users
    const userPromises = Array.from({ length: 5 }).map(async (_, index) => {
      const user = {
        email: `user${index + 1}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        account: `user${index + 1}`,
        name: `user${index + 1}`,
        role: 'user',
        avatar: `https://loremflickr.com/140/140/portrait,nature/?lock=${Math.random() * 100}`,
        cover: `https://loremflickr.com/640/200/landscape/?lock=${Math.random() * 100}`,
        introduction: faker.lorem.words(10),
        created_at: new Date(),
        updated_at: new Date()
      }
      return user
    })

    const user = await Promise.all(userPromises)
    users.push(...user)

    return queryInterface.bulkInsert('Users', users, {})
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
