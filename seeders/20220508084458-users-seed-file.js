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
          avatar:`https://loremflickr.com/140/140/man,woman/?random=${
          Math.random() * 100
        }`,
          cover:`https://loremflickr.com/640/200/landscape,mountain,ocean/?random=${
          Math.random() * 100
        }`,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user1',
          name: 'user1',
          role: 'user',
          introduction: faker.lorem.text().substring(0,160),
          avatar:`https://loremflickr.com/140/140/man,woman/?random=${
          Math.random() * 100
        }`,
          cover:`https://loremflickr.com/640/200/landscape,mountain,ocean/?random=${
          Math.random() * 100
        }`,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user2',
          name: 'user2',
          role: 'user',
          introduction: faker.lorem.text().substring(0,160),
          avatar:`https://loremflickr.com/140/140/man,woman/?random=${
          Math.random() * 100
        }`,
          cover:`https://loremflickr.com/640/200/landscape,mountain,ocean/?random=${
          Math.random() * 100
        }`,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user3@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user3',
          name: 'user3',
          role: 'user',
          introduction: faker.lorem.text().substring(0,160),
          avatar:`https://loremflickr.com/140/140/man,woman/?random=${
          Math.random() * 100
        }`,
          cover:`https://loremflickr.com/640/200/landscape,mountain,ocean/?random=${
          Math.random() * 100
        }`,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user4@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user4',
          name: 'user4',
          role: 'user',
          introduction: faker.lorem.text().substring(0,160),
          avatar:`https://loremflickr.com/140/140/man,woman/?random=${
          Math.random() * 100
        }`,
          cover:`https://loremflickr.com/640/200/landscape,mountain,ocean/?random=${
          Math.random() * 100
        }`,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user5@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user5',
          name: 'user5',
          role: 'user',
          introduction: faker.lorem.text().substring(0,160),
          avatar:`https://loremflickr.com/140/140/man,woman/?random=${
          Math.random() * 100
        }`,
          cover:`https://loremflickr.com/640/200/landscape,mountain,ocean/?random=${
          Math.random() * 100
        }`,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
