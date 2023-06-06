'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先查詢 User 和 Tweet 的 id 有哪些
    const users = await queryInterface.sequelize.query(
      // 過濾掉 User 裡的管理者
      'SELECT id FROM Users WHERE is_admin = false;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // 每一篇 tweet 產生三則隨機 user 的 reply
    for (const tweet of tweets) {
      const replyData = []
      for (let i = 0; i < 3; i++) {
        const reply = {
          comment: faker.lorem.sentence(),
          user_id: users[Math.floor(Math.random() * users.length)].id,
          tweet_id: tweet.id,
          created_at: new Date(),
          updated_at: new Date()
        }
        replyData.push(reply)
      }
      await queryInterface.bulkInsert('Replies', replyData)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
