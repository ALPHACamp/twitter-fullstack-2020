'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [
      {
        account: '@root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'root',
        avatar: `https://loremflickr.com/320/240/paris,girl/all`,
        introduction: faker.lorem.sentences(),
        role: 'admin',
        cover: `https://loremflickr.com/g/320/240/paris`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account: '@user1',
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user1',
        avatar: `https://loremflickr.com/320/240/paris,girl/all`,
        introduction: faker.lorem.sentences(),
        role: 'user',
        cover: `https://loremflickr.com/g/320/240/paris`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account: '@user2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user2',
        avatar: `https://loremflickr.com/320/240/paris,girl/all`,
        introduction: faker.lorem.sentences(),
        role: 'user',
        cover: `https://loremflickr.com/g/320/240/paris`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account: '@user3',
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user3',
        avatar: `https://loremflickr.com/320/240/paris,girl/all`,
        introduction: faker.lorem.sentences(),
        role: 'user',
        cover: `https://loremflickr.com/g/320/240/paris`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account: '@user4',
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user4',
        avatar: `https://loremflickr.com/320/240/paris,girl/all`,
        introduction: faker.lorem.sentences(),
        role: 'user',
        cover: faker.image.nature(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account: '@user5',
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user5',
        avatar: `https://loremflickr.com/320/240/paris,girl/all`,
        introduction: faker.lorem.sentences(),
        role: 'user',
        cover: `https://loremflickr.com/g/320/240/paris`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
    queryInterface.bulkInsert('Tweets',
      Array.from({ length: 60 }).map((item, index) => ({
        UserId: (index % 6) + 1,//1~6
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    return queryInterface.bulkInsert('Replies',
      Array.from({ length: 180 }).map((item, index) => ({
        UserId: Math.floor(Math.random() * 6) + 1, //1~6
        TweetId: (index % 60) + 1,//1~60
        comment: faker.lorem.words(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    )
  },
  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {});
    queryInterface.bulkDelete('Tweets', null, {});
    return queryInterface.bulkDelete('Replies', null, {});
  }
};
