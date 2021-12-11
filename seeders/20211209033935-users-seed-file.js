'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: 1,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'root',
      role: true,
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/human/?random=${Math.random() * 100}`,
      account: 'root',
      cover: `https://loremflickr.com/g/500/200/landmark?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 11,
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user1',
      role: false,
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/human/?random=${Math.random() * 100}`,
      account: 'user1',
      cover: `https://loremflickr.com/g/500/200/landmark?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 21,
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user2',
      role: false,
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/human/?random=${Math.random() * 100}`,
      account: 'user2',
      cover: `https://loremflickr.com/g/500/200/landmark?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 31,
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user3',
      role: false,
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/human/?random=${Math.random() * 100}`,
      account: 'user3',
      cover: `https://loremflickr.com/g/500/200/landmark?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 41,
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user4',
      role: false,
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/human/?random=${Math.random() * 100}`,
      account: 'user4',
      cover: `https://loremflickr.com/g/500/200/landmark?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 51,
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user5',
      role: false,
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/human/?random=${Math.random() * 100}`,
      account: 'user5',
      cover: `https://loremflickr.com/g/500/200/landmark?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
