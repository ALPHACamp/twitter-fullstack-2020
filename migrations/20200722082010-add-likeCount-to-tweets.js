'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Tweets', 'likeCount', {
      type: Sequelize.INTEGER
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Tweets', 'likeCount')
  }
};
