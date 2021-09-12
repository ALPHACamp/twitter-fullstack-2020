'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root-a',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      name: 'root-n',
      introduction: 'I\'m admin. Hello there!',
      avatar: 'https://thumbs.dreamstime.com/b/admin-sign-laptop-icon-stock-vector-166205404.jpg',
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL9L2SNpOkTe_eVOlGVM_47DrMl7Lrgd9EZ0o64rjJRuQ5WbTNbc7dDzL6KrvtIUr72nY&usqp=CAU',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user1-a',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'normal',
      name: 'user1-n',
      introduction: 'I\'m user1. Hello there!',
      avatar: 'https://thumbs.dreamstime.com/b/admin-sign-laptop-icon-stock-vector-166205404.jpg',
      cover: 'https://imgflip.com/s/meme/Bitch-Please.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}