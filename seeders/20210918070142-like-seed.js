'use strict';
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const getUserId = new Promise((resolve, reject) => {
  User.findAll({ raw: true, nest: true })
    .then(users => {
      const userId = []
      users.forEach(user => {
        userId.push(user.id)
      })
      return resolve(userId)
    })
})

const getTweetId = new Promise((resolve, reject) => {
  Tweet.findAll({ raw: true, nest: true })
    .then(tweets => {
      const tweetId = []
      tweets.forEach(tweet => {
        tweetId.push(tweet.id)
      })
      return resolve(tweetId)
    })
})

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userId = await getUserId
    const tweetId = await getTweetId
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: 10 }).map((d, i) =>
      ({
        UserId: userId[Math.floor(Math.random() * userId.length)],
        TweetId: tweetId[Math.floor(Math.random() * tweetId.length)],
        createdAt: new Date(),
        updatedAt: new Date()
      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};