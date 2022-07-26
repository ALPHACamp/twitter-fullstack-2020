'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 100 }).map((_, i) => ({
        description: faker.lorem.sentences(),
        created_at: faker.date.recent(),
        updated_at: new Date(),
        user_id: ~~(i / 10 + 1) // 商取整數
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}

// or 從users種子資料撈id
// const users = await queryInterface.sequelize.query(
//   "SELECT id FROM Users WHERE role = 'user';",
//   { type: queryInterface.sequelize.QueryTypes.SELECT }
// )
