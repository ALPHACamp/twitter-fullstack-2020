'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        account: '@user1',
        name: 'user1',
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        cover: `https://loremflickr.com/320/240/landscape?lock=${Math.random() * 100}`,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        introduction: faker.lorem.sentence(),
        avatar: `https://loremflickr.com/320/240?lock=${Math.random() * 100}`
      },
      {
        id: 11,
        account: '@user2',
        name: 'user2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        cover: `https://loremflickr.com/320/240/landscape?lock=${Math.random() * 100}`,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        introduction: faker.lorem.sentence(),
        avatar: `https://loremflickr.com/320/240?lock=${Math.random() * 100}`
      },
      {
        id: 21,
        account: '@user3',
        name: 'user3',
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        cover: `https://loremflickr.com/320/240/landscape?lock=${Math.random() * 100}`,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        introduction: faker.lorem.sentence(),
        avatar: `https://loremflickr.com/320/240?lock=${Math.random() * 100}`
      },
      {
        id: 31,
        account: '@user4',
        name: 'user4',
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        cover: `https://loremflickr.com/320/240/landscape?lock=${Math.random() * 100}`,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        introduction: faker.lorem.sentence(),
        avatar: `https://loremflickr.com/320/240?lock=${Math.random() * 100}`
      },
      {
        id: 41,
        account: '@user5',
        name: 'user5',
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        cover: `https://loremflickr.com/320/240/landscape?lock=${Math.random() * 100}`,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        introduction: faker.lorem.sentence(),
        avatar: `https://loremflickr.com/320/240?lock=${Math.random() * 100}`
      },
      {
        id: 51,
        account: '@root',
        name: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        cover: `https://loremflickr.com/320/240/landscape?lock=${Math.random() * 100}`,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        introduction: faker.lorem.sentence(),
        avatar: `https://loremflickr.com/320/240?lock=${Math.random() * 100}`
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, { truncate: true })
  }
};
