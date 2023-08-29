'use strict'

/** @type {import('sequelize-cli').Migration} */

const defaultCover = '/images/default-cover.png'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'cover', {
      type: Sequelize.STRING,
      defaultValue: defaultCover
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'Cover')
  }
}
