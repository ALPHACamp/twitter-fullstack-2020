'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Secondreplies', 'replyTo', {
      type: Sequelize.STRING
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Secondreplies', 'replyTo', {
      type: Sequelize.STRING
    })
  }
};
