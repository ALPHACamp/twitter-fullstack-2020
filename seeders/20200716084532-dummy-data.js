'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users',
      [{
        account: '@root',
        name: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        avatar: faker.image.avatar(),
        cover: faker.image.nature(),
        introduction: faker.lorem.sentences(),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account: '@user1',
        name: 'user1',
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        avatar: faker.image.avatar(),
        cover: faker.image.nature(),
        introduction: faker.lorem.sentences(),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account: '@user2',
        name: 'user2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        avatar: faker.image.avatar(),
        cover: faker.image.nature(),
        introduction: faker.lorem.sentences(),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account: '@user3',
        name: 'user3',
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        avatar: faker.image.avatar(),
        cover: faker.image.nature(),
        introduction: faker.lorem.sentences(),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account: '@user4',
        name: 'user4',
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        avatar: faker.image.avatar(),
        cover: faker.image.nature(),
        introduction: faker.lorem.sentences(),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account: '@user5',
        name: 'user5',
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        avatar: faker.image.avatar(),
        cover: faker.image.nature(),
        introduction: faker.lorem.sentences(),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }]
    )
    // 總共有6人，每人10篇tweets
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 60 }).map((_, index) => ({
        UserId: (index % 6) + 1,
        description: faker.lorem.sentences(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
    // 每篇tweets有3則隨機留言
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 180 }).map((_, index) => ({
        UserId: Math.floor(Math.random() * 6) + 1,
        TweetId: (index % 60) + 1,
        comment: faker.lorem.sentences(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Tweets', null, {})
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
