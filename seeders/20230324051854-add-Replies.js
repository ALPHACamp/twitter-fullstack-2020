'use strict';
const faker = require('faker');
const { randomNums } = require('../components/Util');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let tweet_ids = await queryInterface.sequelize.query(
      `SELECT id FROM Tweets`,
    );
    tweet_ids = tweet_ids[0].map((i) => i.id);

    let userIds = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
    );
    userIds = userIds[0].map((i) => i.id);

    const replies = tweet_ids.reduce((acc, value, index, array) => {
      const userids = randomNums(
        Math.floor(Math.random() * userIds.length),
        userIds.length,
      ).map((index) => userIds[index]);
      //console.log(userids);
      const reply = userids.map((d) => ({
        user_id: parseInt(d),
        tweet_id: parseInt(value),
        reply_id: null,
        comment: faker.lorem.sentence(),
        created_at: new Date(),
        updated_at: new Date(),
      }));
      return acc.concat(reply);
    }, []);

    return queryInterface.bulkInsert('Replies', replies, {});
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
    return queryInterface.bulkDelete('Replies', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
