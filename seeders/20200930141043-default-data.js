'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      id: 1,
      name: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'root',
      cover: 'https://picsum.photos/320/240?random=1',
      introduction: faker.lorem.text(),
      avatar: 'https://picsum.photos/320/240?random=1',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'user1',
      cover: 'https://picsum.photos/320/240?random=2',
      introduction: faker.lorem.text(),
      avatar: 'https://picsum.photos/320/240?random=2',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'user2',
      cover: 'https://picsum.photos/320/240?random=3',
      introduction: faker.lorem.text(),
      avatar: 'https://picsum.photos/320/240?random=3',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: 'user3',
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'user3',
      cover: 'https://picsum.photos/320/240?random=4',
      introduction: faker.lorem.text(),
      avatar: 'https://picsum.photos/320/240?random=4',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: 'user4',
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'user4',
      cover: 'https://picsum.photos/320/240?random=5',
      introduction: faker.lorem.text(),
      avatar: 'https://picsum.photos/320/240?random=5',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      name: 'user5',
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'user5',
      cover: 'https://picsum.photos/320/240?random=6',
      introduction: faker.lorem.text(),
      avatar: 'https://picsum.photos/320/240?random=6',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});


    queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((b, i) =>
        ({
          id: i + 1,
          description: faker.lorem.text(),
          UserId: (i % 5) + 2,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})


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
