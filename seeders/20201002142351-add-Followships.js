'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let userIds = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE isAdmin = false;`,
    );
    userIds = userIds[0].map((i) => i.id);
    /*五個user，一個人有0~4個追蹤者*/

    const followships = [
      {
        followerId: userIds[0],
        followingId: userIds[1],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        followerId: userIds[0],
        followingId: userIds[2],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        followerId: userIds[0],
        followingId: userIds[4],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        followerId: userIds[2],
        followingId: userIds[1],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        followerId: userIds[2],
        followingId: userIds[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        followerId: userIds[0],
        followingId: userIds[3],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        followerId: userIds[3],
        followingId: userIds[1],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        followerId: userIds[3],
        followingId: userIds[4],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        followerId: userIds[4],
        followingId: userIds[0],
        createdAt: new Date(),
        updatedAt: new Date(),
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
