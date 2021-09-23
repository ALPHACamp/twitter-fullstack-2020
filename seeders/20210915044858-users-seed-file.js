'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'root',
      account: '@root',
      cover: `https://loremflickr.com/600/200/restaurant,food/?random=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/150/150/restaurant,food/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, 160),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, 
    {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user1',
      account: '@user1',
      cover: `https://loremflickr.com/600/200/restaurant,food/?random=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/150/150/restaurant,food/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, 160),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user2',
      account: '@user2',
      cover: `https://loremflickr.com/600/200/restaurant,food/?random=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/150/150/restaurant,food/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, 160),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user3',
      account: '@user3',
      cover: `https://loremflickr.com/600/200/restaurant,food/?random=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/150/150/restaurant,food/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, 160),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user4',
      account: '@user4',
      cover: `https://loremflickr.com/600/200/restaurant,food/?random=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/150/150/restaurant,food/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, 160),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user5',
      account: '@user5',
      cover: `https://loremflickr.com/600/200/restaurant,food/?random=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/150/150/restaurant,food/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, 160),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
