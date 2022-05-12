'use strict';
const faker= require('faker')
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
    return queryInterface.bulkInsert('Replies',
      Array.from({length:tweetIds.length*3},(element,index)=>({
        comment:faker.lorem.text(),
        UserId:userIds[index%userIds.length].id,
        TweetId:tweetIds[index%tweetIds.length].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
      , {});
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
