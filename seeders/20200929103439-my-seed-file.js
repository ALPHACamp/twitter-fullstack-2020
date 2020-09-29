'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      name: 'root',
      account: '@root',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user1',
      account: '@user1',
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user2',
      account: '@user2',
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user3',
      account: '@user3',
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user4',
      account: '@user4',
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user5',
      account: '@user5',
      avatar: faker.image.avatar(),
      cover: faker.image.nature(),
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
    // .then((userId) => queryInterface.bulkInsert('Tweets',
    //   Array.from({ length: 50 }).map((item, index) =>
    //     ({
    //       UserId: (index % 5),
    //       description: faker.lorem.text(),
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     })
    //   ), {}))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
    // return queryInterface.bulkDelete('Tweets', null, {})
    //   .then(() => queryInterface.bulkDelete('Users', null, {}))

  }
};
