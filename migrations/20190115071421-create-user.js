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
      name: {
        type: Sequelize.STRING
      },
      account:{
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.TEXT
      },
      banner:{
        type: Sequelize.STRING
      },
<<<<<<< HEAD
      is_admin:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
=======
>>>>>>> 74a0347d210e6207a440d11ad2b49b24f2a1fb92
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 74a0347d210e6207a440d11ad2b49b24f2a1fb92
