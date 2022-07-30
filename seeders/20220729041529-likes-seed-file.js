'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先撈出 users (不含 admin) 和 tweet 清單
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const likes = []
    const numberOfTweetToBeLiked = Math.floor(Math.random() * (tweets.length + 1)) // 決定隨機選幾則推文塞入 like （最多就是所有貼文都有 like）
    tweets.sort(() => Math.random() - 0.5) // 把 tweets 亂數排列

    for (let i = 0; i < numberOfTweetToBeLiked; i++) {
      const numberOfUserToLike = Math.ceil(Math.random() * (users.length)) // 決定此則貼文要有幾個人按讚（最低 1 人按讚，最多所有 user 都按讚）
      users.sort(() => Math.random() - 0.5) // 把 users 亂數排列
      for (let x = 0; x < numberOfUserToLike; x++) {
        likes.push({
          UserId: users[x].id,
          TweetId: tweets[i].id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('Likes', likes, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Likes', null, {})
  }
}
