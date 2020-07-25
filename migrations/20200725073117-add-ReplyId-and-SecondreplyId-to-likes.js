'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Likes', 'ReplyId', {
      type: Sequelize.INTEGER
    })
    return queryInterface.addColumn('Likes', 'SecondreplyId', {
      type: Sequelize.INTEGER
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Likes', 'ReplyId')
    return queryInterface.removeColumn('Likes', 'SecondreplyId')
  }
};
