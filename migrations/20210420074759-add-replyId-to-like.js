'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Likes', 'ReplyId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Replies',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Like', 'ReplyId')
  }
};
