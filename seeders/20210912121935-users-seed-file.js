'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')
module.exports = {
  up: (queryInterface, Sequelize) => {

    let data = []
    let amount = 5;
    const root = {
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
    }
    data.push(root)

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

    // await queryInterface.bulkInsert('Users', [{
    //   account: 'root-a',
    //   email: 'root@example.com',
    //   password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
    //   role: 'admin',
    //   name: 'root-n',
    //   introduction: 'I\'m admin. Hello there!',
    //   avatar: 'https://thumbs.dreamstime.com/b/admin-sign-laptop-icon-stock-vector-166205404.jpg',
    //   cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL9L2SNpOkTe_eVOlGVM_47DrMl7Lrgd9EZ0o64rjJRuQ5WbTNbc7dDzL6KrvtIUr72nY&usqp=CAU',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }, {
    //   account: 'user1-a',
    //   email: 'user1@example.com',
    //   password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
    //   role: 'normal',
    //   name: 'user1-n',
    //   introduction: 'I\'m user1. Hello there!',
    //   avatar: 'https://thumbs.dreamstime.com/b/admin-sign-laptop-icon-stock-vector-166205404.jpg',
    //   cover: 'https://imgflip.com/s/meme/Bitch-Please.jpg',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}