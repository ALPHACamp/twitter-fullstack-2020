'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const followships = []

    const getRandomNumber = totalNumber =>
      Math.ceil(Math.random() * (totalNumber - 1))

    for (let i = 1; i < users.length; i++) {
      const randomNumbers = new Set()

      while (randomNumbers.size < 3) {
        const randomNumber = getRandomNumber(users.length)
        if (i !== randomNumber) randomNumbers.add(randomNumber)
      }
      const noRepeatedUsers = [...randomNumbers]

      const result = Array.from({ length: 3 }, (_, index) => ({
        followerId: users[i].id,
        followingId: users[noRepeatedUsers[index]].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      followships.push(...result)
    }

    await queryInterface.bulkInsert('Followships', followships, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
