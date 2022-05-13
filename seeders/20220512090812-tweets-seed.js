'use strict';
const faker = require('faker')
const queryString = 'SELECT `id` FROM `Users`;'
module.exports = {
  up: async(queryInterface, Sequelize) => {
    const userIds = await queryInterface.sequelize.query(
      queryString,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    return queryInterface.bulkInsert('Tweets', 
      Array.from({length: userIds.length*10},(element, index)=>({
        description:faker.lorem.text(),
        UserId:userIds[index%userIds.length].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    , {});
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
