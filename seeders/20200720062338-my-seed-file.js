'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [
      {
        id: 1,
        account: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'root',
        avatar: `https://loremflickr.com/320/240/paris,girl/?lock=6`,
        introduction: faker.lorem.sentences(),
        role: 'admin',
        cover: `https://loremflickr.com/g/320/240/paris/lock=1`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        account: 'user1',
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: faker.name.firstName(),
        avatar: `https://loremflickr.com/320/240/paris,girl?lock=5`,
        introduction: faker.lorem.sentences(),
        role: 'user',
        cover: `https://loremflickr.com/g/320/240/paris?lock=2`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        account: 'user2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: faker.name.firstName(),
        avatar: `https://loremflickr.com/320/240/paris,girl?lock=4`,
        introduction: faker.lorem.sentences(),
        role: 'user',
        cover: `https://loremflickr.com/g/320/240/paris?lock=3`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        account: 'user3',
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: faker.name.firstName(),
        avatar: `https://loremflickr.com/320/240/paris,girl?lock=3`,
        introduction: faker.lorem.sentences(),
        role: 'user',
        cover: `https://loremflickr.com/g/320/240/paris?lock=4`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        account: 'user4',
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: faker.name.firstName(),
        avatar: `https://loremflickr.com/320/240/paris,girl?lock=2`,
        introduction: faker.lorem.sentences(),
        role: 'user',
        cover: `https://loremflickr.com/g/320/240/paris?lock=5`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        account: 'user5',
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: faker.name.firstName(),
        avatar: `https://loremflickr.com/320/240/paris,girl?lock=1`,
        introduction: faker.lorem.sentences(),
        role: 'user',
        cover: `https://loremflickr.com/g/320/240/paris?lock=6`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
    queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((item, index) => ({
        UserId: (index % 5) + 2,//2~6
        description: faker.lorem.sentences().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    return queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((item, index) => ({
        UserId: Math.floor(Math.random() * 5) + 2, //2~6
        TweetId: (index % 50) + 1,//1~50
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