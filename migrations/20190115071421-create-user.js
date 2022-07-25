'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account: {
        type: Sequelize.STRING(50)
      },
      name: {
        type: Sequelize.STRING(50)
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      avatar: {
        allowNull: true,
        type: Sequelize.STRING
      },
      banner: {
        allowNull: true,
        type: Sequelize.STRING
      },
      introduction: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'user'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users')
  }
}
