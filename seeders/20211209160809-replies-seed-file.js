'use strict';
const faker = require('faker')
// const db = require('../models')
// const Tweet = db.Tweet
module.exports = {

  up: async (queryInterface, Sequelize) => {

    let replies = []
    let userIdArray = [11, 21, 31, 41, 51]
    Array.from(userIdArray).map(function (userId, index) {
      for (let i = 0; i < 10; i++) {

        for (let j = 0; j < 3; j++) {
          replies.push({
            UserId: userIdArray[Math.floor(Math.random() * 5)],
            TweetId: userId + i,
            Comment: faker.lorem.text(),
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }
    })
    // console.log(replies)

    await queryInterface.bulkInsert('Replies', replies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
