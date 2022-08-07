'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先撈出 users (不含 admin)
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const followships = []
    for (let i = 0; i < users.length; i++) {
      const numberOfFollowing = Math.floor(Math.random() * users.length) // 決定該使用者要追蹤多少人（最多就是自己以外的人全部追蹤）
      const randomUsers = users.filter((element, index) => index !== i).sort(() => Math.random() - 0.5) // 該使用者的待追蹤對象

      for (let x = 0; x < numberOfFollowing; x++) {
        followships.push({
          followerId: users[i].id,
          followingId: randomUsers[x].id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Followships', followships, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Followships', null, {})
  }
}
