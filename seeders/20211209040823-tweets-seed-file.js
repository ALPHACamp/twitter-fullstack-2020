'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let tweets = []
    Array.from([11, 21, 31, 41, 51]).map(function (userId, index) {
      for (let i = 0; i < 10; i++) {
        tweets.push({
          id: Number(userId) + i,
          UserId: userId,
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    })
    console.log(tweets)
    await queryInterface.bulkInsert('Tweets', tweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
