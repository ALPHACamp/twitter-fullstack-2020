'use strict';
const faker = require('faker');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let userIds = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE is_admin = false;`,
    );
    userIds = userIds[0].map((i) => i.id);
    //console.log(userIds[0].map((i) => i.id));
    const tweets = userIds.reduce((acc, value, index, array) => {
      const tweet = Array.from({ length: 10 }).map((d) => ({
        user_id: parseInt(value),
        description: faker.lorem.sentence(),
        created_at: new Date(),
        updated_at: new Date(),
      }));
      return acc.concat(tweet);
    }, []);

    return queryInterface.bulkInsert('Tweets', tweets, {});
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
    return queryInterface.bulkDelete('Tweets', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
