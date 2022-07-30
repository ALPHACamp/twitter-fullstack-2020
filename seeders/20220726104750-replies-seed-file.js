'use strict'
const faker = require('faker')
const { User, Tweet } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersIds = await User.findAll({
      attributes: ['id'],
      where: { role: 'user' },
      raw: true
    })
    const tweetsIds = await Tweet.findAll({
      attributes: ['id'],
      raw: true
    })

    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 300 }).map((_, index) => ({
        user_id: usersIds[Math.floor(Math.random() * usersIds.length)].id,
        tweet_id: tweetsIds[Math.floor(index / 3)].id,
        comment: faker.lorem.sentences(3),
        created_at: new Date(),
        updated_at: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
