'use strict'

const { followingArr } = require('../helpers/seed-helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE role="user";', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    const followingNumber = users.length * 2
    const arr = followingArr(users, followingNumber)
    await queryInterface.bulkInsert(
      'Followships',
      Array.from({ length: followingNumber }, (_, i) => ({
        follower_id: arr[i].randomIdA,
        following_id: arr[i].randomIdB,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
