module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'account', {
      type        : Sequelize.STRING,
      allowNull   : false,
      defaultValue: false,
    });
    await queryInterface.addColumn('Users', 'cover', {
      type        : Sequelize.STRING,
      defaultValue: `https://loremflickr.com/300/300/portrait/?lock=${Math.random() * 100}`,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};
