'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      account: '@root',
      name: 'root',
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      introduction: faker.lorem.sentences(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: '@user1',
      name: 'user1',
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      introduction: faker.lorem.sentences(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: '@user2',
      name: 'user2',
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      introduction: faker.lorem.sentences(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: '@user3',
      name: 'user3',
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      introduction: faker.lorem.sentences(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: '@user4',
      name: 'user4',
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      introduction: faker.lorem.sentences(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: '@user5',
      name: 'user5',
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      introduction: faker.lorem.sentences(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
    queryInterface.bulkInsert('Tweets',
      Array.from({ length: 60 }).map((_, d) => ({
        UserId: (d % 6) + 1,
        description: faker.lorem.sentences(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
    return queryInterface.bulkInsert('Replies',
      Array.from({ length: 160 }).map((_, d) => ({
        UserId: Math.floor(Math.random() * 6) + 1,
        TweetId: (d % 60) + 1,
        comment: faker.lorem.sentences(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },
  //  truncate: true -> id 從 1 開始
  down: (queryInterface, Sequelize) => {

    queryInterface.bulkDelete('Users', null, { truncate: true })
    queryInterface.bulkDelete('Tweets', null, { truncate: true })
    return queryInterface.bulkDelete('Replies', null, { truncate: true })
  }
};
