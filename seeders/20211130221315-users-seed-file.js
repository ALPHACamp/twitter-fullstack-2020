'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    await queryInterface.bulkInsert('Users', [{
      id: 1, 
      name: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'root',
      cover: `https://loremflickr.com/320/240/personal,cover/?random=${Math.random() * 100}`,
      role: 'admin',
      avatar: `https://loremflickr.com/320/240/avatar/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
    await queryInterface.bulkInsert('Users', 
      Array.from({ length: 5 }).map((d, i) =>
        ({
          id: i + 2,
          name: `user${i + 1}`,
          email: `user${i + 1}@user${i + 1}.com`,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          account: `user${i + 1}`,
          cover: `https://loremflickr.com/320/240/personal,cover/?random=${Math.random() * 100}`,
          role: 'user',
          avatar: `https://loremflickr.com/320/240/avatar/?random=${Math.random() * 100}`,
          introduction: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
    ), {})
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Users', null, {})
  }
};
