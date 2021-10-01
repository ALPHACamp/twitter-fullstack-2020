'use strict';
const faker = require('faker')
const { User, Tweet } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const replies = []
    const tweets = await Tweet.findAll({ attributes: ['id'] })
    const users = await User.findAll({
      raw: true,
      nest: true,
      where: { isAdmin: false },
      attributes: ['id'],
      raw: true
    })

    tweets.forEach((tweet) => {
      [0, 1, 2].forEach((i) => {
        replies.push({
          UserId: users[Math.floor(Math.random() * users.length)].id,
          comment: faker.lorem.sentence(),
          TweetId: tweet.id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
    })

    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, { truncate: true, restartIdentity: true })
  }
};
