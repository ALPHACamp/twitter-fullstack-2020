'use strict'

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs')
const BCRYPT_SALT_ROUNDS = 10
// 先hardcode之後在改成json
const seeds = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    avatar: 'https://loremflickr.com/300/300/girl/?lock=1',
    introduction: 'Hello, I am user1',
    role: 'user'
  },
  {
    name: 'root',
    email: 'root@example.com',
    password: '12345678',
    avatar: 'https://loremflickr.com/300/300/girl/?lock=2',
    introduction: 'Hello, I am root',
    role: 'admin'
  }
]
module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = bcrypt.genSaltSync(BCRYPT_SALT_ROUNDS)

    const userSeeds = seeds.map(seed => {
      // 把seed的password hash過一次
      seed.password = bcrypt.hashSync(seed.password, salt)
      seed.created_at = new Date()
      seed.updated_at = new Date()
      return seed
    })

    await queryInterface.bulkInsert('Users', userSeeds, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
