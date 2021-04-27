'use strict';
const { randomNums } = require('../components/Util');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let tweetIds = await queryInterface.sequelize.query(
      `SELECT id FROM Tweets`,
    );
    tweetIds = tweetIds[0].map((i) => i.id);
    let randomindexs = randomNums(20, tweetIds.length);
    //console.log(randomindexs);
    tweetIds = randomindexs.map((i) => tweetIds[i]);

    let userIds = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE isAdmin = false;`,
    );
    userIds = userIds[0].map((i) => i.id);

    let replyIds = await queryInterface.sequelize.query(
      `SELECT id FROM Replies`,
    );
    replyIds = replyIds[0].map((i) => i.id);

    randomindexs = randomNums(10, replyIds.length);
    //console.log(randomindexs);
    replyIds = randomindexs.map((i) => replyIds[i]);

    const likesIntweets = tweetIds.reduce((acc, value, index, array) => {
      const userids = randomNums(3, userIds.length).map(
        (index) => userIds[index],
      );
      //console.log(userids);
      const likesIntweet = userids.map((d) => ({
        UserId: parseInt(d),
        Position: 'tweet',
        PositionId: parseInt(value),
        isLike: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      return acc.concat(likesIntweet);
    }, []);

    const likesInreplies = replyIds.reduce((acc, value, index, array) => {
      const userids = randomNums(
        Math.floor(Math.random() * userIds.length),
        userIds.length,
      ).map((index) => userIds[index]);
      const likesInreply = userids.map((d) => ({
        UserId: parseInt(d),
        Position: 'reply',
        PositionId: parseInt(value),
        isLike: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      return acc.concat(likesInreply);
    }, likesIntweets);

    return queryInterface.bulkInsert('Likes', likesInreplies, {});
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

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Likes', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
