'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'avatar', {
      type: Sequelize.STRING,
      defaultValue: "https://dktethiopia.org/wp-content/uploads/2021/02/avatar.png"
    })

    await queryInterface.changeColumn('Users', 'cover', {
      type: Sequelize.STRING,
      defaultValue: "https://tokystorage.s3.amazonaws.com/images/default-cover.png"
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'avatar', {
      type: Sequelize.STRING
    })

    await queryInterface.changeColumn('Users', 'cover', {
      type: Sequelize.STRING
    })
  }
};
