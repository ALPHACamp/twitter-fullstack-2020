'use strict';

const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('Users', [{
     id: 1,
     email: 'root@example.com',
     password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
     role: 'admin',
     name: 'root',
     avatar: `https://loremflickr.com/240/240/selfie,boy,girl/?random=${Math.random() * 100}`,
     introduction: faker.lorem.text().substring(0, 160),
     account: 'root',
     cover: `https://loremflickr.com/720/240/landscape/?random=${Math.random() * 100}`,
     tweetCount: 0,
     createdAt: new Date(),
     updatedAt: new Date()
   }, {
     id: 11,
     email: 'user1@example.com',
     password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
     role: 'user',
     name: 'user1',
     avatar: `https://loremflickr.com/240/240/selfie,boy,girl/?random=${Math.random() * 100}`,
     introduction: faker.lorem.text().substring(0, 160),
     account: 'user1',
     cover: `https://loremflickr.com/720/240/landscape/?random=${Math.random() * 100}`,
     tweetCount: 10,
     createdAt: new Date(),
     updatedAt: new Date()
   }, {
     id: 21,
     email: 'user2@example.com',
     password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
     role: 'user',
     name: 'user2',
     avatar: `https://loremflickr.com/240/240/selfie,boy,girl/?random=${Math.random() * 100}`,
     introduction: faker.lorem.text().substring(0, 160),
     account: 'user2',
     cover: `https://loremflickr.com/720/240/landscape/?random=${Math.random() * 100}`,
     tweetCount: 10,
     createdAt: new Date(),
     updatedAt: new Date()
   }, {
     id: 31,
     email: 'user3@example.com',
     password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
     role: 'user',
     name: 'user3',
     avatar: `https://loremflickr.com/240/240/selfie,boy,girl/?random=${Math.random() * 100}`,
     introduction: faker.lorem.text().substring(0, 160),
     account: 'user3',
     cover: `https://loremflickr.com/720/240/landscape/?random=${Math.random() * 100}`,
     tweetCount: 10,
     createdAt: new Date(),
     updatedAt: new Date()
   }, {
     id: 41,
     email: 'user4@example.com',
     password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
     role: 'user',
     name: 'user4',
     avatar: `https://loremflickr.com/240/240/selfie,boy,girl/?random=${Math.random() * 100}`,
     introduction: faker.lorem.text().substring(0, 160),
     account: 'user4',
     cover: `https://loremflickr.com/720/240/landscape/?random=${Math.random() * 100}`,
     tweetCount: 10,
     createdAt: new Date(),
     updatedAt: new Date()
   }, {
     id: 51,
     email: 'user5@example.com',
     password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
     role: 'user',
     name: 'user5',
     avatar: `https://loremflickr.com/240/240/selfie,boy,girl/?random=${Math.random() * 100}`,
     introduction: faker.lorem.text().substring(0, 160),
     account: 'user5',
     cover: `https://loremflickr.com/720/240/landscape/?random=${Math.random() * 100}`,
     tweetCount: 10,
     createdAt: new Date(),
     updatedAt: new Date()
   }
  ], {})
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Users', null, {})
  }
};
