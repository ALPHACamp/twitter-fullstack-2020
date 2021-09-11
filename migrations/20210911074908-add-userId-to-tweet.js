'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Tweets', {
      type: 'foreign key',
      fields: ['UserId'],
      allowNull: false,
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Tweets',
      'Tweets_UserId_Users_fk'
    )
  }
}