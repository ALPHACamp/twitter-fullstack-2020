'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let userIds = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE is_admin = false;`,
    );
    userIds = userIds[0].map((i) => i.id);
    /*五個user，一個人有0~4個追蹤者*/

    const followships = [
      {
        follower_id: userIds[0],
        following_id: userIds[1],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        follower_id: userIds[0],
        following_id: userIds[2],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        follower_id: userIds[0],
        following_id: userIds[4],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        follower_id: userIds[2],
        following_id: userIds[1],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        follower_id: userIds[2],
        following_id: userIds[0],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        follower_id: userIds[0],
        following_id: userIds[3],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        follower_id: userIds[3],
        following_id: userIds[1],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        follower_id: userIds[3],
        following_id: userIds[4],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        follower_id: userIds[4],
        following_id: userIds[0],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    return queryInterface.bulkInsert('Followships', followships, {});
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
    return queryInterface.bulkDelete('Followships', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
