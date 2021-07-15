'use strict';
const faker = require('faker')
const bcrypt = require('bcrypt-nodejs')
const usage = require('../config/usage')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users',
      ['root', 'user1', 'user2', 'user3', 'user4', 'user5']
        .map((item, index) =>
        ({
          id: index * 10 + 1,
          email: item + '@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: index === 0 ? 'root' : faker.name.firstName() + ' ' + faker.name.lastName(),
          avatar: (index % 2) === 0 ? `https://randomuser.me/api/portraits/men/${index}.jpg` : `https://randomuser.me/api/portraits/women/${index}.jpg`,
          introduction: usage.stringLimit(faker.lorem.text(), 140),
          role: index === 0 ? 'admin' : 'user',
          account: '@' + item,
          cover: `https://loremflickr.com/320/240/scenic,view/?lock=${index}`,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};