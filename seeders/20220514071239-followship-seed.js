'use strict';
const userIdsQueryString='SELECT `id` FROM `Users`;'
module.exports = {
  up: async(queryInterface, Sequelize) => {
    const userIds = await queryInterface.sequelize.query(
      userIdsQueryString,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    return queryInterface.bulkInsert('FollowShips', 
      Array.from({length: 10},(element, index)=>({
        followerId: Math.floor(Math.random() * (userIds.length - 1) + 1),
        followingId: Math.floor(Math.random() * (userIds.length - 1) + 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    , {});
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('FollowShips', null, {})
  }
};
