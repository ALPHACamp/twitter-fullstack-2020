'use strict';

const faker = require('faker')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const getUserId = new Promise((resolve, reject) => {
  User.findAll({ raw: true, nest: true })
    .then(users => {
      const userIds = []
      users.forEach(user => {
        userIds.push(user.id)
      })
      return resolve(userIds)
    })
})
const getTweetId = new Promise((resolve, reject) => {
  Tweet.findAll({ raw: true, nest: true })
    .then(tweets => {
      const tweetIds = []
      tweets.forEach(tweet => {
        tweetIds.push(tweet.id)
      })
      return resolve(tweetIds)
    })
})

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userIds = await getUserId
    const tweetIds = await getTweetId

    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 10 }).map((d, i) =>
      ({
        UserId: userIds[Math.floor(Math.random() * userIds.length)],
        TweetId: tweetIds[Math.floor(Math.random() * tweetIds.length)],
        content: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
