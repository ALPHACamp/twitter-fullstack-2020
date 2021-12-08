'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // random pair of user id, then filter out same id pair
    const pairs = []
    for (let i = 0; i < 5; i++) {
      const a = i * 10 + 11
      for (let j = 0; j < i; j++) {
        if (j === 5) {
          break // 如果種子資料太多，會擋住
        }
        const b = j * 10 + 11
        pairs.push([a, b])
      }
    }

    await queryInterface.bulkInsert(
      'Followships',
      pairs.map((pair, index) => ({
        id: index * 10 + 1,
        followerId: pair[0],
        followingId: pair[1],
        createdAt: new Date(
          new Date().setDate(new Date().getDate() - 30 + index)
        ),
        updatedAt: new Date(
          new Date().setDate(new Date().getDate() - 30 + index)
        )
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
