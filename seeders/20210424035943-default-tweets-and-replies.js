'use strict';
const faker = require('faker')
const { User, Tweet } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let users = await User.findAll(
      {
        where: {
          email: ['account_1@example.com', 'account_2@example.com', 'account_3@example.com']
        }
      }
    )
    let userIdList = users.map(d => d.id)

    await queryInterface.bulkInsert('Tweets',
      userIdList.map(d => ({
        UserId: d,
        description: 'default tweets',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

    let tweets = await Tweet.findAll(
      {
        where: { description: 'default tweets' },
        limit: 2
      }
    )

    await queryInterface.bulkInsert('Replies',
      tweets.map(d => ({
        UserId: userIdList[userIdList.length - 1],
        TweetId: d.id,
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
    await queryInterface.bulkDelete('Replies', null, {})
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
