'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Tweets', 'likeCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn('Tweets', 'replyCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Tweets', 'likeCount'),
      queryInterface.removeColumn('Tweets', 'replyCount')
    ])
  }
}