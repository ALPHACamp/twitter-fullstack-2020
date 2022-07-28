'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'follower-counts', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }),
      await queryInterface.addColumn('Users', 'following-counts', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'follower-counts')
    await queryInterface.removeColumn('Users', 'following-counts')
  }
}