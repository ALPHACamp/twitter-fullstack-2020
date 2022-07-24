'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const userlist = [{
  account: 'root',
  email: 'root@example.com',
  password: await bcrypt.hash('12345678', 10),
  name: 'root',
  avatar: 'https://loremflickr.com/320/240/human',
  introduction: faker.lorem.text().slice(0, 159),
  role: 'admin',
  created_at: new Date(),
  updated_at: new Date()
}]

for (let i = 0; i < 5; i++) {
  userlist.push[{
    account: `user${i}`,
    email: `user${i}@example.com`,
    password: await bcrypt.hash('12345678', 10),
    name: `user${i}`,
    avatar: 'https://loremflickr.com/320/240/human',
    introduction: faker.lorem.text().slice(0, 159),
    role: 'user',
    created_at: new Date(),
    updated_at: new Date()
  }]
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', userlist, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
