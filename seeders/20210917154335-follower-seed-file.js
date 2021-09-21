'use strict';

const randomChoose = require('../shuffle')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 5 }, () => {
        const ranNum = randomChoose(users.length, 2)
        return {
          followerId: users[ranNum[0]].id,
          followingId: users[ranNum[1]].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
      ))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}