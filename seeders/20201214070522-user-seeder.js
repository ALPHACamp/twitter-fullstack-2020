'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('Users',
        Array.from({ length: 5 }).map((d, index) => ({
          id: index + 2,
          email: `user${index + 1}@example.com`,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          account: `user${index + 1}`,
          avatar: `https://loremflickr.com/320/320/portrait/?lock=${index}`,
          cover: `https://loremflickr.com/320/320/background/?lock=${index}`,
          introduction: faker.lorem.text(),
          role: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        })), {}),
      queryInterface.bulkInsert('Users', [{
        id: 1,
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'root',
        account: 'root',
        avatar: 'https://loremflickr.com/320/320/portrait/?lock=6',
        cover: 'https://loremflickr.com/320/320/background/?lock=6',
        introduction: faker.lorem.text(),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {})
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
