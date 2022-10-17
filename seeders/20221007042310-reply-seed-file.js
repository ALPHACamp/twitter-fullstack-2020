'use strict'
const faker = require('faker')
const { User } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findAll({ where: { role: 'user' }, raw: true })
    const tweet = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((_, i) => ({
        user_id: user[(i % 5)].id,
        tweet_id: tweet[Math.floor(i / 3)].id,
        comment: faker.lorem.sentences(1),
        created_at: new Date(),
        updated_at: new Date()

      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
