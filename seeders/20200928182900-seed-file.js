'use strict';
const bcrypt = require('bcrypt-nodejs');
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    for (let i = 0; i < 5; i++) {
      queryInterface.bulkInsert('Tweets', Array.from({ length: 10 }).map((item, index) => ({
        id: i * 10 + index + 1,
        UserId: i + 1,
        description: faker.lorem.text().substr(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {})
    }
    for (let i = 0; i < 50; i++) {
      const randomUser = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5)
      queryInterface.bulkInsert('Replies', Array.from({ length: 3 }).map((item, index) => ({
        id: i * 3 + index + 1,
        UserId: randomUser[index],
        TweetId: i + 1,
        comment: faker.lorem.text().substr(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {})
    }
    return queryInterface.bulkInsert('Users', [{
      id: 6,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      name: 'Root Admin',
      account: 'root@example.com',
      introduction: faker.lorem.text(),
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 1,
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: faker.name.findName(),
      account: 'user1@example.com',
      introduction: faker.lorem.text(),
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: faker.name.findName(),
      account: 'user2@example.com',
      introduction: faker.lorem.text(),
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: faker.name.findName(),
      account: 'user3@example.com',
      introduction: faker.lorem.text(),
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: faker.name.findName(),
      account: 'user4@example.com',
      introduction: faker.lorem.text(),
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: faker.name.findName(),
      account: 'user5@example.com',
      introduction: faker.lorem.text(),
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Tweets', null, {});
    queryInterface.bulkDelete('Replies', null, {});
    return queryInterface.bulkDelete('Users', null, {});
  }
};
