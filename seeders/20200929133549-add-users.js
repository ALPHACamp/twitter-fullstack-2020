'use strict';
const bcrypt = require('bcrypt-nodejs');
const faker = require('faker');
const { randomCover, randomAvater } = require('../components/Util');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        name: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: '@root',
        cover: randomCover(),
        avatar: randomAvater(),
        introduction: faker.lorem.text(),
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'user1',
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: '@user1',
        cover: randomCover(),
        avatar: randomAvater(),
        introduction: faker.lorem.text(),
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'user2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: '@user2',
        cover: randomCover(),
        avatar: randomAvater(),
        introduction: faker.lorem.text(),
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'user3',
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: '@user3',
        cover: randomCover(),
        avatar: randomAvater(),
        introduction: faker.lorem.text(),
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'user4',
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: '@user4',
        cover: randomCover(),
        avatar: randomAvater(),
        introduction: faker.lorem.text(),
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'user5',
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: '@user5',
        cover: randomCover(),
        avatar: randomAvater(),
        introduction: faker.lorem.text(),
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
