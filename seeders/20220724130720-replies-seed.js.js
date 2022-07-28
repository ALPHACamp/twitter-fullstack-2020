'use strict';
const faker = require('faker')

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
    const normalUsers = users.splice(1)
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((_, index) => ({
        UserId: normalUsers[Math.floor(index / 30)].id,
        TweetId: tweets[Math.floor(index / 3)].id,
        comment: faker.lorem.sentences(3),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
