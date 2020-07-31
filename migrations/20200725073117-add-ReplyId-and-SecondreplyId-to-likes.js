// 'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Likes', 'ReplyId', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
    return queryInterface.addColumn('Likes', 'SecondreplyId', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Likes', 'ReplyId')
    return queryInterface.removeColumn('Likes', 'SecondreplyId')
  }
};
