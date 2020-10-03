'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let tweetIds = await queryInterface.sequelize.query(
      `SELECT id FROM Tweets`,
    );
    tweetIds = tweetIds[0].map((i) => i.id);

    let userIds = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE isAdmin = false;`,
    );
    userIds = userIds[0].map((i) => i.id);

    let replyIds = await queryInterface.sequelize.query(
      `SELECT id FROM Replies`,
    );
    replyIds = replyIds[0].map((i) => i.id);

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
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
