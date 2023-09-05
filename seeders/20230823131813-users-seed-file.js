'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const delayInMinutes = 5
      const users = [
        {
          account: 'root',
          name: 'root',
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: 'admin'
        },
        {
          account: 'user1',
          name: 'user1',
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: `https://loremflickr.com/200/200/people/?lock=${Math.random() * 100}`,
          cover: `https://loremflickr.com/960/300/landscape/?lock=${Math.random() * 100}`,
          introduction: faker.lorem.text().substring(0, 160),
          role: 'user'
        }]

      const generateUsers = 25

      for (let i = 0; i < generateUsers; i++) {
        const account = faker.name.firstName().substring(1, 10)

        users.push({
          account,
          name: faker.name.findName().substring(1, 50),
          email: `${account}@example.com`,
          password: bcrypt.hashSync(Math.random().toString(36).slice(-8), 10),
          avatar: `https://loremflickr.com/200/200/people/?lock=${Math.random() * 100}`,
          cover: `https://loremflickr.com/960/300/landscape/?lock=${Math.random() * 100}`,
          introduction: faker.lorem.text().substring(0, 160),
          role: 'user'
        })
      }

      for (let i = 0; i < users.length; i++) {
        const createdAt = new Date(Date.now() - i * delayInMinutes * 60000).toISOString().substring(0, 16)
        const updatedAt = createdAt

        users[i].created_at = createdAt
        users[i].updated_at = updatedAt
      }

      await queryInterface.bulkInsert('Users', users, {})
      console.log('Users table seeding completed successfully.')
    } catch (error) {
      console.error('Error seeding Users.', error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Users', {})
      console.log('Users table reverted successfully.')
    } catch (error) {
      console.error('Error reverting Users table.', error)
    }
  }
}
