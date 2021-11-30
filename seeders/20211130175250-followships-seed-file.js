'use strict';
// random pair of user id, then filter out same id pair
const randomPair = Array
  .from({ length: 14 })
  .map((d) => ([
    Math.ceil(Math.random() * 5) * 10 + 1,
    Math.ceil(Math.random() * 5) * 10 + 1
  ])).filter((pair) => pair[0] !== pair[1])

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Followships',
      randomPair.map((pair, index) => ({
        id: index * 10 + 1,
        followerId: pair[0],
        followingId: pair[1],
        createdAt: new Date(new Date().setDate(new Date().getDate() - 30 + index)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 30 + index))
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
