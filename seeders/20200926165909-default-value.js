'use strict';

const bcrypt = require("bcryptjs");
const faker = require("faker");
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [
      {
        account: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'root',
        avatar: faker.image.avatar(),
        introduction: faker.lorem.sentences(),
        isAdmin: true,
        background: faker.image.imageUrl(),
        // `https://loremflickr.com/g/320/240/paris/?lock=2`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account: 'user1',
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: faker.name.firstName(),
        avatar: faker.image.avatar(),
        introduction: faker.lorem.sentences(),
        isAdmin: false,
        background: faker.image.imageUrl(),
        // `https://loremflickr.com/320/240/paris?lock=2`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account: 'user2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: faker.name.firstName(),
        avatar: faker.image.avatar(),
        introduction: faker.lorem.sentences(),
        isAdmin: true,
        background: faker.image.imageUrl(),
        
        // `https://loremflickr.com/g/320/240/paris?lock=3`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account: 'user3',
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: faker.name.firstName(),
        avatar: faker.image.avatar(),
        introduction: faker.lorem.sentences(),
        isAdmin: false,
        background: faker.image.imageUrl(),
        // `https://loremflickr.com/g/320/240/paris?lock=4`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account: 'user4',
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: faker.name.firstName(),
        avatar: faker.image.avatar(),
        introduction: faker.lorem.sentences(),
        isAdmin: false,
        background: faker.image.imageUrl(),
        // `https://loremflickr.com/g/320/240/paris?lock=5`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account: 'user5',
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: faker.name.firstName(),
        avatar: faker.image.avatar(),
        introduction: faker.lorem.sentences(),
        isAdmin: false,
        background: faker.image.imageUrl(),
        // `https://loremflickr.com/g/320/240/paris?lock=6`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
    queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((item, index) => ({
        id: index + 1,
        UserId: Math.floor(Math.random() * 5) + 2,
        description: faker.lorem.sentences().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    return queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((item, index) => ({
        id: index + 1,
        UserId: Math.floor(Math.random() * 5) + 2,
        TweetId: (index % 50) + 1,
        comment: faker.lorem.words(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    )
  },
  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("Users", null, {});
    queryInterface.bulkDelete("Tweets", null, {});
    return queryInterface.bulkDelete("Replies", null, {});
  }
};
