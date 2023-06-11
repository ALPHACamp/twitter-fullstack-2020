'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'cover', {
      type: Sequelize.STRING,
      defaultValue: 'https://i.imgur.com/b7U6LXD.jpg'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'cover', {
      type: Sequelize.STRING,
      defaultValue: 'https://imgur.com/a/41GqmRB'
    })
  }
}
