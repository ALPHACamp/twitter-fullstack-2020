'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface) => {
    const [usersId, tweetsId] = await Promise.all([
      queryInterface.sequelize.query(
        'SELECT id FROM Users WHERE name != \'root\';',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),
      queryInterface.sequelize.query(
        'SELECT id FROM Tweets;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ])
    // create Replies array
    const fields = tweetsId.map(tweet => {
      // draw 3 independent user
      const copyUsersId = [...usersId]
      const drawUsersId = []
      const repeat = 3
      for (let i = 0; i < repeat; i++) {
        const index = Math.floor(Math.random() * copyUsersId.length)
        drawUsersId.push(copyUsersId.splice(index, 1)[0])
      }

      // return replies array
      return Array.from({ length: 3 }, (v, i) => (
        {
          UserId: drawUsersId[i].id,
          TweetId: tweet.id,
          comment: faker.lorem.text().slice(0, 140),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ))
    }).flat()
    await queryInterface.bulkInsert('Replies', fields, {})
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
