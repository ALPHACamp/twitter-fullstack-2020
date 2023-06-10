'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'account', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    })
    await queryInterface.addColumn('Users', 'cover', {
      type: Sequelize.STRING,
      defaultValue: 'https://i.imgur.com/TGRK7uy.png'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'account')
    await queryInterface.removeColumn('Users', 'cover')
  }
}
