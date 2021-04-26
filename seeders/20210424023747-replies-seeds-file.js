'use strict';
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' } })
    const tweets = await Tweet.findAll()
    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 150 }).map((_, index) => ({
        id: index,
        UserId: users[(index % 5)].id,
        TweetId: tweets[Math.floor(Math.random() * 50)].id,
        comment: faker.lorem.text().substring(0, 50),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {});
  }
};
