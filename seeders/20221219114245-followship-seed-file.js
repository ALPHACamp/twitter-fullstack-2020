'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE role = 'user';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const userId = users.slice()
    const followships = []

    for (let i = 0; i < users.length * (users.length - 1); i++) {
      const followingId = userId.filter(user => user.id !== userId[Math.floor(i / (users.length - 1))].id)
      followships.push({
        follower_id: userId[Math.floor(i / (users.length - 1))].id,
        following_id: followingId[i % (users.length - 1)].id,
        created_at: new Date(),
        updated_at: new Date()
      })
    }

    await queryInterface.bulkInsert('Followships', followships)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
