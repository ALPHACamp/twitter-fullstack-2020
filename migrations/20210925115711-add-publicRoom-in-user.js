'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Users', 'publicRoom', {
        type: Sequelize.BOOLEAN
      })
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Users', 'publicRoom')
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  }
};
