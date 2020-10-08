'use strict';
const bcrypt = require('bcrypt-nodejs');
const faker = require('faker');
const { randomCover, randomAvater } = require('../components/Util');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const arr = [];
    const admin = {
      name: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'root',
      cover: randomCover(),
      avatar: randomAvater(),
      introduction: faker.lorem.sentence(),
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    arr.push(admin);
    //console.log(arr);
    const users = Array.from({ length: 5 }).reduce((acc, value, index) => {
      const user = {
        name: `user${index + 1}`,
        email: `user${index + 1}@example.com`,
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: `user${index + 1}`,
        cover: randomCover(),
        avatar: randomAvater(),
        introduction: faker.lorem.sentence(),
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      //console.log(acc);
      acc.push(user);
      return acc;
    }, arr);
    const admin2 = {
      name: 'root',
      email: 'root@example.com2',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'root@example.com',
      cover: randomCover(),
      avatar: randomAvater(),
      introduction: faker.lorem.sentence(),
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    //console.log(users);
    return queryInterface.bulkInsert('Users', users, {});
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
