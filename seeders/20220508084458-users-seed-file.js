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
          password: await bcrypt.hash('12345678', 10),
          account: 'root',
          name: 'root',
          role: 'admin',
          introduction: faker.lorem.text().substring(0, 160),
          avatar: `https://loremflickr.com/140/140/man,woman/?random=${
          Math.random() * 100
        }`,
          cover: `https://loremflickr.com/640/200/landscape,mountain,ocean/?random=${
          Math.random() * 100
        }`,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
    await queryInterface.bulkInsert(
      'Users',
      Array.from({ length: 5 }, (_, index) => ({
        email: `user${index + 1}@example.com`,
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        account: `user${index + 1}`,
        name: `user${index + 1}`,
        role: 'user',
        introduction: faker.lorem.text().substring(0, 160),
        avatar: `https://loremflickr.com/140/140/man,woman/?random=${
          Math.random() * 100
        }`,
        cover: `https://loremflickr.com/640/200/landscape,mountain,ocean/?random=${
          Math.random() * 100
        }`,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
