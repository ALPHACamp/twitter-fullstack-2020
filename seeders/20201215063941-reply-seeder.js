'use strict';
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('Replies', Array.from({ length: 50 }).map((d, index) => ({
        id: index + 1,
        TweetId: index + 1,
        UserId: Math.floor(Math.random() * 5) + 2,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {}),
      queryInterface.bulkInsert('Replies', Array.from({ length: 50 }).map((d, index) => ({
        id: 50 + index + 1,
        TweetId: index + 1,
        UserId: Math.floor(Math.random() * 5) + 2,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {}),
      queryInterface.bulkInsert('Replies', Array.from({ length: 50 }).map((d, index) => ({
        id: 100 + index + 1,
        TweetId: index + 1,
        UserId: Math.floor(Math.random() * 5) + 2,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {})
    ])
    // return Promise.all(Array.from({ length: 3 }).map((currentValue, j) => {
    //   queryInterface.bulkInsert('Replies', Array.from({ length: 50 }).map((d, index) => ({
    //     id: j * 3 + index + 1,
    //     TweetId: index + 1,
    //     UserId: Math.floor(Math.random() * 5) + 2,
    //     comment: faker.lorem.sentence(),
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   })), {})
    // }))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Replies', null, {})
  }
};
