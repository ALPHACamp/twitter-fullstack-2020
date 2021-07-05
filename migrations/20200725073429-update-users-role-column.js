'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('users', 'role', {
      type: Sequelize.STRING,
      defaultValue: 'user'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('users', 'role', {
      type: Sequelize.STRING,
    })
  }
};
