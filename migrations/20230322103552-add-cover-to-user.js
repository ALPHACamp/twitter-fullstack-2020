'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'cover', {
      type: Sequelize.STRING,
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('User', 'cover')
  }
};
