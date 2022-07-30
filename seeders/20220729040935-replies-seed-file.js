'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先撈出 users (不含 admin) 和 tweet 清單，結果各是一個 array
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const numberOfReplies = 3 // 每篇 tweet 有隨機 3 則留言
    const upperLimitOfTweet = 140 // 每篇貼文上限 140 字

    const replies = []
    for (const tweet of tweets) {
      for (let i = 0; i < numberOfReplies; i++) {
        const randomWords = Math.floor(Math.random() * (upperLimitOfTweet + 1))
        replies.push({
          TweetId: tweet.id,
          UserId: users[Math.floor(Math.random() * users.length)].id,
          comment: faker.lorem.words(upperLimitOfTweet).substring(0, randomWords),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('Replies', replies, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Replies', null, {})
  }
}
