'use strict';

const randomChoose = require('../shuffle')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: 5 }, () => {
        const ranNum1 = randomChoose(users.length, 1)[0]
        const ranNum2 = randomChoose(tweets.length, 1)[0]
        return {
          UserId: users[ranNum1].id,
          TweetId: tweets[ranNum2].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
      ))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
