'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    await queryInterface.addColumn('Users', 'account', {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn('Users', 'cover', {
      type: Sequelize.STRING,
    })
    await queryInterface.addColumn('Users', 'isAdmin', {
      type: Sequelize.STRING,
    })
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface.removeColumn('Users', 'account')
    await queryInterface.removeColumn('Users', 'cover')
    await queryInterface.removeColumn('Users', 'isAdmin')
  }
};
