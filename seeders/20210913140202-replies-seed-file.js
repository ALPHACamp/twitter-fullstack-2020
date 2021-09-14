'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
