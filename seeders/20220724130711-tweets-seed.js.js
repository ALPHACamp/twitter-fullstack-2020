'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // const normalUsers = users.splice(1)
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((_, index) => ({
        user_id: users[Math.floor(index / 10)].id,
        description: faker.lorem.sentences(3),
        created_at: new Date(),
        updated_at: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
