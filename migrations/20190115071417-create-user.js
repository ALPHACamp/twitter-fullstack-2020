'use strict';

const { sequelize } = require("../models");

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
<<<<<<< HEAD
        allowNull: false,
        type: Sequelize.STRING,
=======
        unique: true,
        type: Sequelize.STRING
>>>>>>> 8ee42d69193be08cc2a2aeb5145bdcdadb121a4c
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
<<<<<<< HEAD
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
=======
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
>>>>>>> 8ee42d69193be08cc2a2aeb5145bdcdadb121a4c
      },
      description: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      cover: {
        type: Sequelize.STRING
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
