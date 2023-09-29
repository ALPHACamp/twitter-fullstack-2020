'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const uniqueUserData = [
      { account: 'root', name: 'root', email: 'root@example.com', role: 'admin' },
      { account: 'user1', name: 'user1', email: 'user1@example.com', role: 'user' },
      { account: 'user2', name: 'user2', email: 'user2@example.com', role: 'user' },
      { account: 'user3', name: 'user3', email: 'user3@example.com', role: 'user' },
      { account: 'user4', name: 'user4', email: 'user4@example.com', role: 'user' },
      { account: 'user5', name: 'user5', email: 'user5@example.com', role: 'user' },
      { account: 'user6', name: 'user6', email: 'user6@example.com', role: 'user' },
      { account: 'user7', name: 'user7', email: 'user7@example.com', role: 'user' },
      { account: 'user8', name: 'user8', email: 'user8@example.com', role: 'user' },
      { account: 'user9', name: 'user9', email: 'user9@example.com', role: 'user' },
      { account: 'user10', name: 'user10', email: 'user10@example.com', role: 'user' }
    ]
    const userPromiseData = uniqueUserData.map(async userData => ({
      ...userData,
      avatar: 'https://i.imgur.com/7sJckYK.png',
      cover: 'https://i.imgur.com/f42NkFh.png',
      introduction: faker.lorem.sentence(),
      created_at: new Date(),
      updated_at: new Date(),
      password: await bcrypt.hash('12345678', 10)
    }))
    const userSeederData = await Promise.all(userPromiseData)
    await queryInterface.bulkInsert('Users', userSeederData, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
