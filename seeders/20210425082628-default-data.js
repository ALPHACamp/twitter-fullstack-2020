'use strict'

const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // Admin
    // 5 個一般使用者
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        isAdmin: true,
        name: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: 'root',
        cover: 'https://loremflickr.com/600/200/brazil,rio',
        introduction: faker.lorem.text(),
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        isAdmin: false,
        name: 'user1',
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: 'user1',
        cover: 'https://loremflickr.com/600/200/brazil,rio',
        introduction: faker.lorem.text(),
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        isAdmin: false,
        name: 'user2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: 'user2',
        cover: 'https://loremflickr.com/600/200/brazil,rio',
        introduction: faker.lorem.text(),
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        isAdmin: false,
        name: 'user3',
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: 'user3',
        cover: 'https://loremflickr.com/600/200/brazil,rio',
        introduction: faker.lorem.text(),
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        isAdmin: false,
        name: 'user4',
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: 'user4',
        cover: 'https://loremflickr.com/600/200/brazil,rio',
        introduction: faker.lorem.text(),
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        isAdmin: false,
        name: 'user5',
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: 'user5',
        cover: 'https://loremflickr.com/600/200/brazil,rio',
        introduction: faker.lorem.text(),
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // 每個使用者有 10 篇 post
    await queryInterface.bulkInsert('Tweets',
      Array
        .from({ length: 50 })
        .map((b, i) =>
        ({
          id: i + 1,
          description: faker.lorem.text(),
          UserId: (i % 5) + 2,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})

    // 每篇 post 有隨機 3 個留言者，每個人有 1 則留言
    for (let i = 0; i < 3; i++) {
      await queryInterface.bulkInsert('Replies',
        Array
          .from({ length: 50 })
          .map((b, i) => 
          ({
            comment: faker.lorem.text(),
            UserId: Math.floor(Math.random() * 5) + 2,
            TweetId: i + 1,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Tweets', null, {})
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
