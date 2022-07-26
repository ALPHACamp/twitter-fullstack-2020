'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 產生 三十 位使用者資訊
    const usersArray = []
    for (let i = 1; i < 30; i++) {
      usersArray.push({
        email: `user${i}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        name: `user${i}`,
        account: `user${i}`,
        avatar: `https://randomuser.me/api/portraits/men/${i + 1}.jpg`,
        introduction: faker.lorem.text(),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      })
    }

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'root',
          account: 'root',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          introduction: faker.lorem.text(),
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        },
        ...usersArray
      ],
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', null, {})
  }
}
