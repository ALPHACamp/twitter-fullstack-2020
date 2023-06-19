'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 新增管理員資料
    await queryInterface.bulkInsert('Users', [
      {
        account: 'root',
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
    // 新增五名使用者
    const userData = []
    for (let i = 0; i < 5; i++) {
      const user = {
        account: `user${i}`,
        email: `user${i}@example.com`,
        name: `user${i}`,
        password: await bcrypt.hash('12345678', 10),
        intro: faker.lorem.text(),
        avatar: `https://loremflickr.com/320/240/headshot/?random=${Math.random() * 10}`,
        cover: 'https://images.unsplash.com/photo-1580436541340-36b8d0c60bae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }
      userData.push(user)
    }
    await queryInterface.bulkInsert('Users', userData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
