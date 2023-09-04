'use strict'

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs')

const BCRYPT_SALT_ROUNDS = 10
const USER_AMOUNT = 15

module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = bcrypt.genSaltSync(BCRYPT_SALT_ROUNDS)

    await queryInterface.bulkInsert('Users',
      Array.from({ length: USER_AMOUNT }, (_, index) => {
        if (index === 0) {
          return {
            name: 'root',
            account: 'root',
            email: 'root@example.com',
            password: bcrypt.hashSync('12345678', salt),
            avatar: `https://loremflickr.com/300/300/girl/?lock=${index + 1}`,
            introduction: 'Hello, I am root',
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date()
          }
        } else {
          return {
            name: `user${index}`,
            account: `user${index}`,
            email: `user${index}@example.com`,
            password: bcrypt.hashSync('12345678', salt),
            avatar: `https://loremflickr.com/300/300/girl/?lock=${index + 1}`,
            introduction: `Hello, I am user${index}`,
            role: 'user',
            created_at: new Date(),
            updated_at: new Date()
          }
        }
      })
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
