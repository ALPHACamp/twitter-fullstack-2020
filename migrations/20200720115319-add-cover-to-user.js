'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'cover', {
<<<<<<< HEAD
      type: Sequelize.STRING
=======
      type: Sequelize.STRING,
>>>>>>> 2de11848b17de0e41c8b66f3d22984ad02dfe5dd
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'cover')
  }
};
