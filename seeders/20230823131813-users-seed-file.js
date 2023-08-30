'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

const generateUsers = async () => {
  const users = []
  for (let i = 1; i <= 5; i++) {
    const user = {
      account: `user${i}`,
      name: `user${i}`,
      email: `user${i}@example.com`,
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      avatar: `https://loremflickr.com/200/200/people/?lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, 50),
      cover: `https://loremflickr.com/960/300/landscape/?lock=${Math.random() * 100}`
    }
    users.push(user)
  }
  return users
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const generatedUsers = await generateUsers()
      const users = [
        ...generatedUsers,
        {
          account: 'root',
          name: 'root',
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: 'admin',
          avatar: `https://loremflickr.com/200/200/people/?lock=${Math.random() * 100}`,
          introduction: faker.lorem.text().substring(0, 50),
          cover: `https://loremflickr.com/960/300/landscape/?lock=${Math.random() * 100}`
          // ,
          // created_at: new Date(),
          // updated_at: new Date()
        }
      ]

      const delayInMinutes = 5

      for (let i = 0; i < users.length; i++) {
        const createdAt = new Date(Date.now() - i * delayInMinutes * 60000).toISOString().substring(0, 16)

        users[i].created_at = createdAt
        users[i].updated_at = createdAt
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
