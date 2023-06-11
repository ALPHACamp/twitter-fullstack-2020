'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'avatar', {
      type: Sequelize.STRING,
      defaultValue: '/_base/icon/user-photo.svg'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'avatar', {
      type: Sequelize.STRING
    })
  }
}
