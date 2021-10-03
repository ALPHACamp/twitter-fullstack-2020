'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: true,
          name: 'root',
          account: 'root',
          createdAt: new Date(),
          updatedAt: new Date(),
          avatar: `https://loremflickr.com/320/240/boy/?lock=${
            Math.random() * 100
          }`,
          cover: `https://loremflickr.com/600/200/cover/?lock=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.text().substring(0, 160),
        },
        {
          email: 'user1@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: false,
          name: 'user1',
          account: 'user1',
          createdAt: new Date(),
          updatedAt: new Date(),
          avatar: `https://loremflickr.com/320/240/boy/?lock=${
            Math.random() * 100
          }`,
          cover: `https://loremflickr.com/600/200/cover/?lock=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.text().substring(0, 160),
        },
        {
          email: 'user2@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: false,
          name: 'user2',
          account: 'user2',
          createdAt: new Date(),
          updatedAt: new Date(),
          avatar: `https://loremflickr.com/320/240/boy/?lock=${
            Math.random() * 100
          }`,
          cover: `https://loremflickr.com/600/200/cover/?lock=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.text().substring(0, 160),
        },
      ],
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  },
}
