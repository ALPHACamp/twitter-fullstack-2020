'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn( 'Users', 'backgrundimg', {
      type: Sequelize.STRING
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn( 'users', 'backgrundimg' );
  }
};