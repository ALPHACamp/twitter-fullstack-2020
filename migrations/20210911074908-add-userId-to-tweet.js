'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tweets', 'UserId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        field: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tweets', 'UserId')
  }
}