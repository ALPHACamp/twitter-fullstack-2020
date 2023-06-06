'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      account: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: 'https://i.imgur.com/f7FShQ2.png'
      },
      cover: {
        type: Sequelize.STRING,
        defaultValue: 'https://i.imgur.com/xVTwoZ1.jpeg'
      },
      introduction: {
        type: Sequelize.TEXT
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'user'
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
  down:async(queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};