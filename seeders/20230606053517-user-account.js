'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        account: 'root',
        name: 'root',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        account: 'user1',
        name: 'user1',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
