'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const likeArr = []
    // 每一個使用者隨機按讚

    // 使用者
    users.forEach(user => {
      // 展開tweet
      const tweetArr = [...tweets]

      for (let i = 0; i < users.length; i++) {
        // 隨機數字->tweet
        const randomNumber = Math.floor(Math.random() * tweetArr.length)
        likeArr.push({
          user_id: user.id,
          tweet_id: tweetArr[randomNumber].id,
          created_at: new Date(),
          updated_at: new Date()
        })
        tweetArr.splice(randomNumber, 1)
      }
    })
    await queryInterface.bulkInsert('Likes', likeArr, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
