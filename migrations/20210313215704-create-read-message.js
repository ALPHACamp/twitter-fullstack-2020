module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ReadMessages', {
    id: {
      allowNull    : false,
      autoIncrement: true,
      primaryKey   : true,
      type         : Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    messageId: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type     : Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type     : Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('ReadMessages'),
};
