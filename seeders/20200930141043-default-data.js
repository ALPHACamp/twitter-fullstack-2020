'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      name: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'root',
      cover: 'https://loremflickr.com/320/240/paris/all?random=1',
      introduction: faker.lorem.text(),
      avatar: 'https://loremflickr.com/320/240/people/all?random=1',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'user1',
      cover: 'https://loremflickr.com/320/240/paris/all?random=2',
      introduction: faker.lorem.text(),
      avatar: 'https://loremflickr.com/320/240/people/all?random=2',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'user2',
      cover: 'https://loremflickr.com/320/240/paris/all?random=3',
      introduction: faker.lorem.text(),
      avatar: 'https://loremflickr.com/320/240/people/all?random=3',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user3',
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'user3',
      cover: 'https://loremflickr.com/320/240/paris/all?random=4',
      introduction: faker.lorem.text(),
      avatar: 'https://loremflickr.com/320/240/people/all?random=4',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user4',
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'user4',
      cover: 'https://loremflickr.com/320/240/paris/all?random=5',
      introduction: faker.lorem.text(),
      avatar: 'https://loremflickr.com/320/240/people/all?random=5',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user5',
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'user5',
      cover: 'https://loremflickr.com/320/240/paris/all?random=6',
      introduction: faker.lorem.text(),
      avatar: 'https://loremflickr.com/320/240/people/all?random=6',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    for (let i = 2; i <= 6; i++) {
      queryInterface.bulkInsert('Tweets',
        Array.from({ length: 10 }).map(b =>
          ({
            description: faker.lorem.text(),
            UserId: i,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
    }

    for (let i = 0; i < 3; i++) {
      queryInterface.bulkInsert('Replies',
        Array.from({ length: 50 }).map((b, i) =>
          ({
            comment: faker.lorem.text(),
            UserId: Math.floor(Math.random() * 5) + 2,
            TweetId: i + 1,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
    }

    return queryInterface.bulkInsert('Followships', [{
      followerId: '2',
      followingId: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Tweets', null, {})
    queryInterface.bulkDelete('Replies', null, {})
    return queryInterface.bulkDelete('Followships', null, {})
  }
};
