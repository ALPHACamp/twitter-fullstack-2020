'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      account: {
        type: Sequelize.STRING(50),
        unique: true,
      },
      name: {
        type: Sequelize.STRING(50),
      },
<<<<<<< HEAD
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
=======
      email: {
        type: Sequelize.STRING(50),
        unique: true,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
      },
      password: {
        type: Sequelize.STRING(50),
      },

      avatar: {
        type: Sequelize.STRING,
      },
      introduction: {
        type: Sequelize.STRING(150),
      },
      role: {
        type: Sequelize.STRING,
>>>>>>> develop
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
<<<<<<< HEAD
        type: Sequelize.DATE
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      image: {
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
=======
        type: Sequelize.DATE,
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users')
  },
}
>>>>>>> develop
