'use strict'
const { getNoRepeatRandomIndex } = require('../helpers/seeder-helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Followships',
      // 每位user隨機追蹤1~14人，且不能追蹤自己
      users.reduce((acc, cur, index) => {
        return acc.concat(Array.from(
          getNoRepeatRandomIndex(users.length, null, index),
          (v, i) => ({
            followingId: cur.id,
            followerId: users[v].id,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ))
      }, []), {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
