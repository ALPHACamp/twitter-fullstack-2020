'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //隨機建立20個replies (Condition:5位使用者,10個tweets)
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 20 }).map((d, i) =>
      ({
        UserId: Math.floor(Math.random() * 5) + 2,
        TweetId: Math.floor(Math.random() * 10) + 1,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
