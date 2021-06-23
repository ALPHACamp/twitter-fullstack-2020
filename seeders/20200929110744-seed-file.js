'use strict';

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      id: '1',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: '1',
      name: 'root',
      account: '@root',
      avatar: faker.image.avatar(),
      introduction: faker.lorem.text(),
      cover: faker.image.cats(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: '2',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: '0',
      name: 'user1',
      account: '@user1',
      avatar: faker.image.avatar(),
      introduction: faker.lorem.text(),
      cover: faker.image.sports(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: '3',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: '0',
      name: 'user2',
      account: '@user2',
      avatar: faker.image.avatar(),
      introduction: faker.lorem.text(),
      cover: faker.image.nightlife(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: '4',
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: '0',
      name: 'user3',
      account: '@user3',
      avatar: faker.image.avatar(),
      introduction: faker.lorem.text(),
      cover: faker.image.nightlife(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: '5',
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: '0',
      name: 'user4',
      account: '@user4',
      avatar: faker.image.avatar(),
      introduction: faker.lorem.text(),
      cover: faker.image.nightlife(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});

    queryInterface.bulkInsert('Tweets',
      Array.from({ length: 10 }).map((item, index) => ({
        id: index + 1,
        UserId: Math.floor(Math.random() * 5) + 1,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {});
    return queryInterface.bulkInsert('Replies',
      Array.from({ length: 20 }).map((item, index) => ({
        id: index + 1,
        UserId: Math.floor(Math.random() * 5) + 1,
        TweetId: Math.floor(Math.random() * 10) + 1,
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {});
    queryInterface.bulkDelete('Tweets', null, {});
    return queryInterface.bulkDelete("Replies", null, {});
  }
};
