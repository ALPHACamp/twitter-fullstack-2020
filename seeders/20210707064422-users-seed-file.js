'use strict';
const bcrypt = require('bcryptjs')
const users = Array.from({ length: 5 }).map((d, i) => ({
  account: `user${i + 1}`,
  name: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
  is_admin: false,
  isNoticed: false,
  avatar: `https://loremflickr.com/250/250/avator/?random=${i}`,
  createdAt: new Date(),
  updatedAt: new Date()
}))
users.unshift({
  account: 'root',
  name: 'root',
  email: 'root@example.com',
  password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
  is_admin: true,
  isNoticed: false,
  avatar: 'https://loremflickr.com/250/250/avator/?random=50',
  createdAt: new Date(),
  updatedAt: new Date()
})

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', users, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, { truncate: true, restartIdentity: true })
  }
};
