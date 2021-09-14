'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Followships',
      [2, 3, 4, 5, 6].map((item, index) => ({
        // const a = item.indexOf(item[index]);
        followerId: item[index],
        followingId: item.splice(0, 1).Math.floor(Math.random() * 4) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      , {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Followships', null, {})
  }
}