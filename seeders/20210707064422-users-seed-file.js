'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      description: 'admin account',
      img: 'https://loremflickr.com/250/250/avator/?random=1',
      bg_img: '',
      is_admin: true,
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      description: 'user account',
      img: 'https://loremflickr.com/250/250/avator/?random=3',
      bg_img: '',
      is_admin: false,
      name: 'user1',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      description: 'user account',
      img: 'https://loremflickr.com/250/250/avator/?random=5',
      bg_img: '',
      is_admin: false,
      name: 'user2',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user3',
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      description: 'user account',
      img: 'https://loremflickr.com/250/250/avator/?random=7',
      bg_img: '',
      is_admin: false,
      name: 'user3',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user4',
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      description: 'user account',
      img: 'https://loremflickr.com/250/250/avator/?random=9',
      bg_img: '',
      is_admin: false,
      name: 'user4',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user5',
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      description: 'user account',
      img: 'https://loremflickr.com/250/250/avator/?random=11',
      bg_img: '',
      is_admin: false,
      name: 'user5',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
