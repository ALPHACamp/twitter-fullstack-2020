'use strict'

const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先放入 admin
    const users = [{
      account: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date()
    }]

    const numberOfUsers = 15 // 本次預計生成 15 個 normal users
    for (let i = 1; i <= numberOfUsers; i++) { // 放入 normal users
      users.push({
        account: `user${i}`,
        email: `user${i}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        name: `使用者${i}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    await queryInterface.bulkInsert('Users', users, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
