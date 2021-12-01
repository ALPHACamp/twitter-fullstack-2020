'use strict';
const faker = require('faker')
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
    await queryInterface.bulkInsert('Tweets', 
      // 讓tweet Po文時間更分散, 到時候不會按時間排結果都是某人的 tweets
      Array.from({ length: 50 }).map((d, i) =>
        (
          {
            id: i + 1,
            description: faker.lorem.text(),
            UserId: (i % 5) + 2,    // 從id:2 user1 開始
            createdAt: faker.date.recent(),
            updatedAt: new Date()
          }
        )
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
