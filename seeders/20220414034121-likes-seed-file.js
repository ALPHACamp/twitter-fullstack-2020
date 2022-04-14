'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role IS null;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const likes = []
    users.forEach(user => {
      for (; likes.length < 15 * (users.indexOf(user) + 1);) {
        const chosenTweet = tweets[Math.floor(Math.random() * tweets.length)].id
        if (likes.findIndex(l => l.tweetId === chosenTweet && l.userId === user.id) === -1) {
          likes.push({
            userId: user.id,
            tweetId: chosenTweet,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }
    })
    await queryInterface.bulkInsert('Likes', likes)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
