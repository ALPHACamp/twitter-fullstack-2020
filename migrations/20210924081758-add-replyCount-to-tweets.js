'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Tweets', 'replyCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Tweets', 'replyCount')
  },
}
