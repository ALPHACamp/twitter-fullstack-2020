'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')
module.exports = {
  up: (queryInterface, Sequelize) => {

    let data = []
    let amount = 5;
    data.push({
      account: 'root123',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      name: 'root',
      introduction: 'Hello there! I\'m root. There will come a time when you believe everything is finished. That will be the beginning.',
      avatar: 'https://thumbs.dreamstime.com/b/admin-sign-laptop-icon-stock-vector-166205404.jpg',
      cover: 'https://i.pinimg.com/originals/59/35/5f/59355f751c1e3698cc6360b1a7390094.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    while (amount--) {
      data.push({
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