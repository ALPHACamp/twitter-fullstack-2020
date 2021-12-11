'use strict'
const faker = require('faker')
const { USER_ID_BEGIN, TWEETS_PER_USER, TWEET_COUNT } = require('../config/seeder.js')
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
    await queryInterface.bulkInsert(
      'Tweets',
      // 讓tweet Po文時間更分散, 到時候不會按時間排結果都是某人的 tweets
      Array.from({ length: TWEET_COUNT }).map((_, i) => ({
        id: i + 1,
        UserId: Math.floor(i / TWEETS_PER_USER) + USER_ID_BEGIN,
        description: faker.lorem.text(),
        createdAt: faker.date.recent(),
        updatedAt: new Date(),
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Tweets', null, {})
  },
}
