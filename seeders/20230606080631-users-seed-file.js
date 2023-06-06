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
        is_admin: true,
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
        cover: 'https://unsplash.com/photos/cO9_joZ1FdA',
        is_admin: false,
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
