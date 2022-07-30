'use strict'
const faker = require('faker')
const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersIds = await User.findAll({
      attributes: ['id'],
      where: { role: 'user' },
      raw: true
    })
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 100 }).map((_, index) => ({
        user_id: usersIds[Math.floor(index / 10)].id,
        description: faker.lorem.sentences(),
        created_at: faker.date.recent(),
        updated_at: new Date()
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
