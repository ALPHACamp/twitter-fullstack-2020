'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Users', 'cover', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Users', 'account', {
        type: Sequelize.STRING,
      })
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Users', 'cover'),
      queryInterface.removeColumn('Users', 'account')
    ]);
  }
};