'use strict';
const faker = require('faker')
const bcrypt = require('bcrypt-nodejs')
const usage = require('../config/usage')
const avatarURL = 'https://i.pinimg.com/564x/'
const coverURL = 'https://i.imgur.com/'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users',
      [
        { name: 'root', avatar: '3b/d1/74/3bd17412878c1792295a0f8433cebfd8.jpg', cover: '3JEtooD.png' },
        { name: 'user1', avatar: '4d/2a/62/4d2a62b6ffd935d3b8cbcfed235cc28d.jpg', cover: 'NAQ0dTR.png' },
        { name: 'user2', avatar: '2b/3c/28/2b3c283ab1e08a1e6c112a0fba5e738b.jpg', cover: 'iB7ugep.png' },
        { name: 'user3', avatar: '19/7b/f0/197bf02db0f49084c770527423c12fef.jpg', cover: 'm1rFvSa.png' },
        { name: 'user4', avatar: '63/c9/7c/63c97ccc7b0572ef0cdb11487a298aa5.jpg', cover: 'hZ08bZt.jpeg' },
        { name: 'user5', avatar: 'c1/b4/43/c1b443bfd87d822816ab81b68c345823.jpg', cover: 'LoIiczF.png' },
      ]
        .map((item, index) =>
        ({
          id: index * 10 + 1,
          email: item + '@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: index === 0 ? 'root' : faker.name.firstName() + ' ' + faker.name.lastName(),
          avatar: avatarURL + item.avatar,
          introduction: usage.stringLimit(faker.lorem.text(), 140),
          role: index === 0 ? 'admin' : 'user',
          account: '@' + item.name,
          cover: coverURL + item.cover,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};