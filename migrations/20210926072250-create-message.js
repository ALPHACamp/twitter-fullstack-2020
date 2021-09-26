'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Message', 'content', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Message', 'roomId', {
        type: Sequelize.INTEGER,
      })
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Message', 'content'),
      queryInterface.removeColumn('Message', 'roomId')
    ]);
  }
};