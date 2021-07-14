'use strict';

const bcrypt = require('bcryptjs')
const faker = require('faker')

let additionalIds = Array.from(Array(31).keys()).filter(num => num >= 7) //[7,8,...,30]

//僅產出第 7~30 個user，前 6 個依舊寫死
const additionalUsers = additionalIds.map(id => ({
  id: id,
  account: faker.lorem.word(),
  email: faker.internet.email(),
  password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
  name: faker.name.findName(),
  avatar: faker.internet.avatar(),
  introduction: faker.lorem.text(),
  isAdmin: false,
  createdAt: new Date(),
  updatedAt: new Date()
}))

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        account: 'garrison',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'Mr. Garrison',
        avatar: 'https://i.imgur.com/YKBbHOh.jpg',
        cover: 'https://i.imgur.com/VOJrAEv.jpg',
        introduction: '我是 Mr. Garrison',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        account: 'wendy',
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'Wendy',
        avatar: 'https://i.imgur.com/wTrRC9V.jpg',
        cover: 'https://i.imgur.com/yBsheRl.jpg',
        introduction: 'Hi~ my name is Wendy',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        account: 'butters',
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'Butters',
        avatar: 'https://i.imgur.com/cEZW2Xs.jpg',
        cover: 'https://i.imgur.com/n2oDqJ5.jpg',
        introduction: 'Hey, thi...this is Butters...',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        account: 'eric',
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'Eric cartman',
        avatar: '',
        cover: 'https://i.imgur.com/n2oDqJ5.jpg',
        introduction: 'Hi~ This is Cartman',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        account: 'marsh',
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'Randy Marsh',
        avatar: 'https://i.imgur.com/rUP5zLA.png',
        cover: '',
        introduction: 'Hi~ This is Randy Marsh',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        account: 'stan',
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'Stan',
        avatar: '',
        cover: '',
        introduction: 'Hi~ This is Elliot\'s introduction',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ...additionalUsers
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};