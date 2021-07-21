'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')
const stl = require('../config/stl')
let role
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', ['root', 'user1', 'user2', 'user3', 'user4', 'user5']
      .map((item, index) =>
      (
        role = index,
        {
          id: index * 10 + 1,
          email: item + '@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: index === 0 ? 'root' : faker.name.firstName() + ' ' + faker.name.lastName(),
          avatar: (index % 2) === 0 ? `https://randomuser.me/api/portraits/men/${index}.jpg` : `https://randomuser.me/api/portraits/women/${index}.jpg`,
          introduction: stl.stringLimit(faker.lorem.text(), 140),
          role: index === 0 ? true : false,
          account: '@' + item,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      )
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
