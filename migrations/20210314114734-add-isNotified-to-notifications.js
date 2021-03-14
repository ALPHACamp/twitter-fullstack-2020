module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Notifications', 'isNotified', {
    type        : Sequelize.BOOLEAN,
    defaultValue: false,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Notifications', 'isNotified'),
};
