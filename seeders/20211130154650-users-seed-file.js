'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // all the email and name of users/admin list here
    const userSeed = [
      { email: 'root@example.com', name: 'Admin', account: 'root' },
      { email: 'user1@example.com', name: 'User1', account: 'user1' },
      { email: 'user2@example.com', name: 'User2', account: 'user2' },
      { email: 'user3@example.com', name: 'User3', account: 'user3' },
      { email: 'user4@example.com', name: 'User4', account: 'user4' },
      { email: 'user5@example.com', name: 'User5', account: 'user5' }
    ]
    // all users/admin use same password, do it once here
    const password = bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null)

    await queryInterface.bulkInsert(
      'Users',
      userSeed.map((user, index) => ({
        id: index * 10 + 1,
        email: user.email,
        password: password,
        name: user.name,
        avatar: `https://randomuser.me/api/portraits/med/men/${index}.jpg`,
        introduction: faker.lorem.text().substring(0, 160),
        role: user.name === 'Admin' ? 'admin' : 'user',
        account: user.account,
        cover: `https://loremflickr.com/320/240/city/?random=${
          Math.random() * 100
        }`,
        createdAt: new Date(
          new Date().setDate(new Date().getDate() - 240 + index)
        ),
        updatedAt: new Date(
          new Date().setDate(new Date().getDate() - 240 + index)
        )
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
