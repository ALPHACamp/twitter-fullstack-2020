'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')
module.exports = {
  up: (queryInterface, Sequelize) => {
    //固定一位使用者及隨機建立 4 個一般使用者
    let amount = 4
    let data = []
    data.push({
      id: 5,
      account: 'root123',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      name: 'root',
      introduction: 'Hello there! I\'m root. There will come a time when you believe everything is finished. That will be the beginning.',
      avatar: `https://loremflickr.com/320/240/boy/?lock=${Math.random() * 100}`,
      cover: `https://loremflickr.com/820/462/cover/?lock=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 15,
      account: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'normal',
      name: 'user',
      introduction: 'Hello there! I\'m user. There will come a time when you believe everything is finished. That will be the beginning.',
      avatar: `https://loremflickr.com/320/240/boy/?lock=${Math.random() * 100}`,
      cover: `https://loremflickr.com/820/462/cover/?lock=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    )

    while (amount--) {
      data.push({
        id: 25 + 10 * amount,
        account: faker.internet.userName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        role: 'normal',
        name: faker.name.findName(),
        introduction: faker.lorem.sentence(),
        avatar: `https://loremflickr.com/320/240/boy/?lock=${Math.random() * 100}`,
        cover: `https://loremflickr.com/820/462/cover/?lock=${Math.random() * 100}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    return queryInterface.bulkInsert('Users', data, {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}