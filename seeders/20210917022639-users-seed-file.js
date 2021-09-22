'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')
const users = Array.from({ length: 5 }).map((d, i) => ({
  email: `user${i + 1}@example.com`,
  password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
  name: `user${i + 1}`,
  avatar: `https://loremflickr.com/250/250/avatar/?random=${i}`,
  account: `user${i + 1}`,
  cover: `https://loremflickr.com/250/240/Landscape/?random=${i}`,
  introduction: faker.lorem.text(),
  role: 'user',
  isAdmin: false,
  createdAt: new Date(),
  updatedAt: new Date()
}))
users.unshift({
  email: 'root@example.com',
  password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
  name: 'root',
  avatar: 'https://loremflickr.com/250/250/avatar/?random=1',
  account: 'root',
  cover: 'https://loremflickr.com/250/240/Landscape/?random=1',
  introduction: faker.lorem.text(),
  role: 'admin',
  isAdmin: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', users, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
