'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'root',
        account: '@root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()

      },
      {
        id: 2,
        name: 'user1',
        account: '@user1',
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        role: 'user',
        avatar: faker.image.avatar(),
        cover: faker.image.nature(),
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'user2',
        account: '@user2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        role: 'user',
        avatar: faker.image.avatar(),
        cover: faker.image.nature(),
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'user3',
        account: '@user3',
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        role: 'user',
        avatar: faker.image.avatar(),
        cover: faker.image.nature(),
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'user4',
        account: '@user4',
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        role: 'user',
        avatar: faker.image.avatar(),
        cover: faker.image.nature(),
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'user5',
        account: '@user5',
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        role: 'user',
        avatar: faker.image.avatar(),
        cover: faker.image.nature(),
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
    return queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((item, index) =>
        ({
          id: index + 1,
          UserId: (index % 5) + 2,
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    return queryInterface.bulkDelete('Tweets', null, {})
  }
};
