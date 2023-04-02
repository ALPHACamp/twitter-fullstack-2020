'use strict';
const { randomNums } = require('../components/Util');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let tweet_ids = await queryInterface.sequelize.query(
      `SELECT id FROM Tweets`,
    );
    tweet_ids = tweet_ids[0].map((i) => i.id);
    let randomindexs = randomNums(20, tweet_ids.length);
    //console.log(randomindexs);
    tweet_ids = randomindexs.map((i) => tweet_ids[i]);

    let userIds = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
    );
    userIds = userIds[0].map((i) => i.id);

    let reply_ids = await queryInterface.sequelize.query(
      `SELECT id FROM Replies`,
    );
    reply_ids = reply_ids[0].map((i) => i.id);

    randomindexs = randomNums(10, reply_ids.length);
    //console.log(randomindexs);
    reply_ids = randomindexs.map((i) => reply_ids[i]);

    const likesIntweets = tweet_ids.reduce((acc, value, index, array) => {
      const userids = randomNums(3, userIds.length).map(
        (index) => userIds[index],
      );
      //console.log(userids);
      const likesIntweet = userids.map((d) => ({
        user_id: parseInt(d),
        position: 'tweet',
        tweet_id: parseInt(value),
        is_like: true,
        created_at: new Date(),
        updated_at: new Date(),
      }));
      return acc.concat(likesIntweet);
    }, []);

    const likesInreplies = reply_ids.reduce((acc, value, index, array) => {
      const userids = randomNums(
        Math.floor(Math.random() * userIds.length),
        userIds.length,
      ).map((index) => userIds[index]);
      const likesInreply = userids.map((d) => ({
        user_id: parseInt(d),
        position: 'reply',
        tweet_id: parseInt(value),
        is_like: true,
        created_at: new Date(),
        updated_at: new Date(),
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
