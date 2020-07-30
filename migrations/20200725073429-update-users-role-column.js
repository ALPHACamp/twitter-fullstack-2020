'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.STRING,
      defaultValue: 'user'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.STRING,
    })
  }
};
