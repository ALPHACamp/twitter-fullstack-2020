const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = [];
    tweets.push(
      Array.from({ length: 50 })
      .map((item, index) => ({
        id         : index * 10 + 1,
        UserId     : Math.floor((index + 10) / 10) * 10 + 1,
        description: faker.lorem.words(15),
        createdAt  : new Date(),
        updatedAt  : new Date(),
      })),
    );

    await queryInterface.bulkInsert('Tweets', ...tweets, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {});
  },
};
