'use strict';
const userIdsQueryString="SELECT `id` FROM `Users`WHERE role='user';"
module.exports = {
  up: async(queryInterface, Sequelize) => {
    const userIds = await queryInterface.sequelize.query(
      userIdsQueryString,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const combinationArray=[]
    for(const i of userIds){
      for(const j of userIds){
        if(!(i.id===j.id))
        combinationArray.push([i.id,j.id])
      }
    }
    return queryInterface.bulkInsert('FollowShips', 
      Array.from({length: 6},()=>{
        const index=Math.floor(Math.random() * combinationArray.length)
        const [followerId,followingId]=combinationArray.splice(index,1)[0]
        return {
          followerId,
          followingId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    , {});
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('FollowShips', null, {})
  }
};
