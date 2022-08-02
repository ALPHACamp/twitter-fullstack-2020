'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE role = "user";', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    for (let i = 0; i < users.length; i++) {
      const followUser = users.filter(user => user.id !== users[i].id)
      const radomNum = Math.floor(Math.random() * (followUser.length + 1))
      for (let u = 0; u < radomNum; u++) {
        const follow = followUser.splice(Math.floor(Math.random() * followUser.length), 1)
        await queryInterface.bulkInsert('Followships', [{
          following_id: users[i].id,
          follower_id: follow[0].id,
          created_at: new Date(),
          updated_at: new Date()
        }], {})
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
