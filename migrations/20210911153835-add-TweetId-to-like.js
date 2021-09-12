'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Likes', 'TweetId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Tweets',
        key: 'id'
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Likes',
      'TweetId'
    )
  }
}