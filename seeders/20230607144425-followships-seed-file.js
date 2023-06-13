'use strict'

const { doNotFollowSelf } = require('../helpers/seed-helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE role="user";', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    await queryInterface.bulkInsert(
      'Followships',
      Array.from({ length: 50 }, () => ({
        ...doNotFollowSelf(users),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
