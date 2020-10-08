'use strict';
const faker = require('faker');
const { randomNums } = require('../components/Util');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let repliesIds = await queryInterface.sequelize.query(
      `SELECT id,TweetId FROM Replies`,
    );
    repliesIds = repliesIds[0].map((i) => ({ id: i.id, TweetId: i.TweetId }));

    //console.log(repliesIds);
    let userIds = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE isAdmin = false;`,
    );
    userIds = userIds[0].map((i) => i.id);
    let random = randomNums(
      Math.floor(repliesIds.length * 0.3),
      repliesIds.length,
    );
    //console.log(Math.floor(Math.random() * repliesIds.length * 0.7));

    repliesIds = random.map((index) => repliesIds[index]);
    //console.log(repliesIds);
    const replies = repliesIds.reduce((acc, value, index, array) => {
      const userids = randomNums(
        Math.floor(Math.random() * userIds.length),
        userIds.length,
      ).map((index) => userIds[index]);
      //console.log(userids);

      const reply = userids.map((d) => ({
        UserId: parseInt(d),
        TweetId: value.TweetId,
        ReplyId: value.id,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
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
