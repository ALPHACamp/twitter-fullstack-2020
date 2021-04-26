'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('Likes', 'ReplyId')
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.addColumn('Likes', 'ReplyId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Replies',
        key: 'id'
      }
    })
  }
};
