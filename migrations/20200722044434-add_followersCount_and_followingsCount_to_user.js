'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return (
      queryInterface.addColumn('Users', 'followerCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn('Users', 'followingCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      })
    )
  },

  down: async (queryInterface, Sequelize) => {
    return (
      queryInterface.removeColumn('Users', 'followerCount'),
      queryInterface.removeColumn('Users', 'followingCount')
    )
  }
}
