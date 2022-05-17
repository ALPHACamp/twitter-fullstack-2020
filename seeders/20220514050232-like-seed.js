'use strict';
const userIdsQueryString='SELECT `id` FROM `Users`;'
const tweetIdsQueryString='SELECT `id` FROM `Tweets`;'

module.exports = {
  up: async(queryInterface, Sequelize) => {
    const [userIds,tweetIds] = await Promise.all([
      queryInterface.sequelize.query(
        userIdsQueryString,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),queryInterface.sequelize.query(
        tweetIdsQueryString,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ])
    return queryInterface.bulkInsert('Likes',
      Array.from({length:tweetIds.length},(element,index)=>({
        UserId:Math.floor(Math.random() * (userIds.length - 1) + 1),
        TweetId:tweetIds[index%tweetIds.length].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
      , {});
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  
  }
};
