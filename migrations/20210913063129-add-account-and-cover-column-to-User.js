'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Users', 'account', {
        type: Sequelize.STRING
      })
      await queryInterface.addColumn('Users', 'cover', {
        type: Sequelize.STRING
      })
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
    // return [
    //   queryInterface.addColumn('Users', 'account', {
    //     type: Sequelize.STRING
    //   }),
    //   queryInterface.addColumn('Users', 'cover', {
    //     type: Sequelize.STRING
    //   })
    // ]
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Users', 'account');
      await queryInterface.removeColumn('Users', 'cover');
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
