'use strict';
const faker = require('faker')
const { User, Tweet } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const replies = []
    const tweets = await Tweet.findAll({ attributes: ['id'] })
    const users = await User.findAll({
      where: { is_admin: false },
      attributes: ['id']
    })

    tweets.forEach((tweet) => {
      [0, 1, 2].forEach((i) => {
        let userIdRandom = Math.floor(Math.random() * (users.length + 2))
        if (userIdRandom < 2) {
          userIdRandom += 2
        }
        replies.push({
          UserId: users[userIdRandom].id,
          content: faker.lorem.word(),
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