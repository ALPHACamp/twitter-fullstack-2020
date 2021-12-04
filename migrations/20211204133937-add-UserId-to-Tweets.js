'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Tweets', 'UserId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Tweets', 'UserId')
  }
};
