'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const admin = {
      id: 5,
      account: 'root@example.com',
      name: 'Admin',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: "admin",
      avatar: 'https://loremflickr.com/320/240/peoplerandom=100',
      cover: 'https://loremflickr.com/320/240/viewrandom=100',
      followingCount: 0,
      followerCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
      
    const users = Array.from({ length: 5 }).map((item, i) => ({
      id: (i + 1) * 10 + 5,
      account: `account${i + 1}`,
      name: `user${i + 1}`,
      email: faker.internet.email(),
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: "user",
      avatar: `https://loremflickr.com/320/240/people?lock=${i}`,
      cover: `https://loremflickr.com/320/240/view?lock=${i}`,
      description: faker.lorem.text(),
      followingCount: 0,
      followerCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    users.push(admin)

    await queryInterface.bulkInsert('Users', users, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}