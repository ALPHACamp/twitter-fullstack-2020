'use strict'
const bcrypt = require('bcryptjs')

const generateUsers = async () => {
  const users = []
  for (let i = 1; i <= 5; i++) {
    const user = {
      account: `user${i}`,
      name: `user${i}`,
      email: `user${i}@example.com`,
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }
    users.push(user)
  }
  return users
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const userDone = await generateUsers()
      await queryInterface.bulkInsert(
        'Users',
        [
          ...userDone,
          {
            account: 'root',
            name: 'root',
            email: 'root@example.com',
            password: await bcrypt.hash('12345678', 10),
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        {}
      )
    } catch (err) {
      console.log(err)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
