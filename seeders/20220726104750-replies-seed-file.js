'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    console.log(users)
    console.log(tweets)
    const deleteAdmin = users.splice(1)
    console.log(deleteAdmin)
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 100 }).map((_, index) => ({
        user_id: deleteAdmin[Math.floor(Math.random() * deleteAdmin.length)].id,
        tweet_id: tweets[Math.floor(index / 3)].id,
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
