'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE role = 'user';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await Promise.all(Array.from({ length: 5 }, (_, i) =>
      queryInterface.bulkInsert('Likes',
        users.map(user => {
          return {
            user_id: user.id,
            tweet_id: tweets[Math.floor(Math.random() * tweets.length)].id,
            is_like: true,
            created_at: new Date(),
            updated_at: new Date()
          }
        }))))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
