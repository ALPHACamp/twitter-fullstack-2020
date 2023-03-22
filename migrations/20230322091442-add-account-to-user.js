'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'account', {
      type: Sequelize.STRING,
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('User', 'account')
  }
};
