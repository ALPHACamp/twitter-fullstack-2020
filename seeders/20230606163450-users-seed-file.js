'use strict'
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        account: 'root',
        name: 'root',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        account: 'user1',
        name: 'user1',
        role: 'user',
        avatar: `https://loremflickr.com/140/140/portrait/?lock=${
          Math.random() * 100
        }`,
        cover: `https://loremflickr.com/640/200/landscape/?lock=${
          Math.random() * 100
        }`,
        introduction: faker.lorem.words(10),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        account: 'user2',
        name: faker.name.findName(),
        role: 'user',
        avatar: `https://loremflickr.com/140/140/portrait/?lock=${
          Math.random() * 100
        }`,
        cover: `https://loremflickr.com/640/200/landscape/?lock=${
          Math.random() * 100
        }`,
        introduction: faker.lorem.words(10),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        account: 'user3',
        name: faker.name.findName(),
        role: 'user',
        avatar: `https://loremflickr.com/140/140/portrait/?lock=${
          Math.random() * 100
        }`,
        cover: `https://loremflickr.com/640/200/landscape/?lock=${
          Math.random() * 100
        }`,
        introduction: faker.lorem.words(10),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        account: 'user4',
        name: faker.name.findName(),
        role: 'user',
        avatar: `https://loremflickr.com/140/140/portrait/?lock=${
          Math.random() * 100
        }`,
        cover: `https://loremflickr.com/640/200/landscape/?lock=${
          Math.random() * 100
        }`,
        introduction: faker.lorem.words(10),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        account: 'user5',
        name: faker.name.findName(),
        role: 'user',
        avatar: `https://loremflickr.com/140/140/portrait/?lock=${
          Math.random() * 100
        }`,
        cover: `https://loremflickr.com/640/200/landscape/?lock=${
          Math.random() * 100
        }`,
        introduction: faker.lorem.words(10),
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
