'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')

module.exports = {

  up: async (queryInterface, Sequelize) => {

    const arr = Array.from({ length: 20 }).map((d, i) => ({
      account: `account_${i + 1}`,
      email: `account_${i + 1}@example.com`,
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      isAdmin: false,
      name: faker.name.findName(),
      avatar: `https://randomuser.me/api/portraits/women/${i + 1}.jpg`,
      cover: 'https://loremflickr.com/600/200/brazil,rio',
      introduction: faker.lorem.sentence(),
      role: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const root = {
      account: 'root',
      name: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    arr.unshift(root)

    await queryInterface.bulkInsert('Users', arr)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
