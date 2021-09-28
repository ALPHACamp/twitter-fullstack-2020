'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Users', 'followingCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn('Users', 'followerCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'followingCount'),
      queryInterface.removeColumn('Users', 'followerCount')
    ])
  }
}