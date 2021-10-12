'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'admin',
      name: 'root',
      avatar: `https://loremflickr.com/320/240/paris,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      introduction: faker.lorem.text().slice(0, 100),
      account: 'root',
      cover: `https://loremflickr.com/320/240/paris,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user1',
      avatar: `https://loremflickr.com/320/240/paris,boy/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      introduction: faker.lorem.text().slice(0, 100),
      account: 'user1',
      cover: `https://loremflickr.com/320/240/paris,boy/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user2',
      avatar: `https://loremflickr.com/320/240/tokyo,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      introduction: faker.lorem.text().slice(0, 100),
      account: 'user2',
      cover: `https://loremflickr.com/320/240/newyork,boy/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user3',
      avatar: `https://loremflickr.com/320/240/paris,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      introduction: faker.lorem.text().slice(0, 100),
      account: 'user3',
      cover: `https://loremflickr.com/320/240/tokyo,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user4',
      avatar: `https://loremflickr.com/320/240/tokyo,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      introduction: faker.lorem.text().slice(0, 100),
      account: 'user4',
      cover: `https://loremflickr.com/320/240/tokyo,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user5@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user5',
      avatar: `https://loremflickr.com/320/240/tokyo,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      introduction: faker.lorem.text().slice(0, 100),
      account: 'user5',
      cover: `https://loremflickr.com/320/240/tokyo,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user6@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user6',
      avatar: `https://loremflickr.com/320/240/tokyo,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      introduction: faker.lorem.text().slice(0, 100),
      account: 'user6',
      cover: `https://loremflickr.com/320/240/paris,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'user7@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user7',
      avatar: `https://loremflickr.com/320/240/tokyo,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      introduction: faker.lorem.text().slice(0, 100),
      account: 'user7',
      cover: `https://loremflickr.com/320/240/india,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'user8@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user8',
      avatar: `https://loremflickr.com/320/240/tokyo,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      introduction: faker.lorem.text().slice(0, 100),
      account: 'user8',
      cover: `https://loremflickr.com/320/240/shanhai,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'user9@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user9',
      avatar: `https://loremflickr.com/320/240/beijing,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      introduction: faker.lorem.text().slice(0, 100),
      account: 'user9',
      cover: `https://loremflickr.com/320/240/paris,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user10@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user10',
      avatar: `https://loremflickr.com/320/240/beijing,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      introduction: faker.lorem.text().slice(0, 100),
      account: 'user10',
      cover: `https://loremflickr.com/320/240/paris,girl/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
