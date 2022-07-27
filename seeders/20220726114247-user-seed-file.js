'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_INTRODUCTION_WORDS = 100 // 自我介紹字數上限160，預設100字

    await queryInterface.bulkInsert('Users',
      // 指定帳號: root, user1
      [{
        account: 'root',
        name: 'root',
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        avatar: 'https://loremflickr.com/320/240/people',
        banner: 'https://loremflickr.com/640/240/sky',
        introduction: faker.lorem.words(DEFAULT_INTRODUCTION_WORDS),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        account: 'user1',
        name: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        avatar: 'https://loremflickr.com/320/240/people',
        banner: 'https://loremflickr.com/640/240/sky',
        introduction: faker.lorem.words(DEFAULT_INTRODUCTION_WORDS),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }]
        .concat(Array.from({ length: 13 }, (_, i) => {
          // 減少重複機會，於名字後加上隨機數字作為account
          const account = faker.name.firstName() + Math.random().toString().slice(-4)

          return {
            account,
            name: faker.name.findName(),
            email: `${account}@example.com`,
            password: bcrypt.hashSync(Math.random().toString(36).slice(-8), 10),
            avatar: 'https://loremflickr.com/320/240/people',
            banner: 'https://loremflickr.com/640/240/sky',
            introduction: faker.lorem.words(DEFAULT_INTRODUCTION_WORDS),
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })), {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
