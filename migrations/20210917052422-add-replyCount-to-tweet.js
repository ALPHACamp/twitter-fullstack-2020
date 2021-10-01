'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tweets', 'replyCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      unsigned: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tweets', 'replyCount')
  }
};
