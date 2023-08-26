'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 10 }, (v, i) => '推文測試' + i.toString())
        .map(item => {
          return {
            description: item,
            user_id: users[Math.floor(Math.random() * users.length)].id,
            created_at: new Date(),
            updated_at: new Date()
          }
        }
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
