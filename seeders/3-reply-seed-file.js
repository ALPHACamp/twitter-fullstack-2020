const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const replies = [];
    let replyId = 1;
    for (let i = 0; i < 50; i += 1) {
      const tweetId = i * 10 + 1;
      replies.push({
        id       : replyId,
        UserId   : (Math.floor(Math.random() * Math.floor(5)) + 1) * 10 + 1,
        TweetId  : tweetId,
        comment  : faker.lorem.words(15),
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        id       : replyId + 10,
        UserId   : (Math.floor(Math.random() * Math.floor(5)) + 1) * 10 + 1,
        TweetId  : tweetId,
        comment  : faker.lorem.words(15),
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        id       : replyId + 20,
        UserId   : (Math.floor(Math.random() * Math.floor(5)) + 1) * 10 + 1,
        TweetId  : tweetId,
        comment  : faker.lorem.words(15),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      replyId += 30;
    }

    await queryInterface.bulkInsert('Replies', replies, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {});
  },
};
