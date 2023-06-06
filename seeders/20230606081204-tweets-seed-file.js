'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先查詢 User 的 id 有哪些
    const users = await queryInterface.sequelize.query(
      // 過濾掉 User 裡的管理者
      'SELECT id FROM Users WHERE is_admin = false;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    for (const user of users) {
      // 每一位使用者產生 10 篇推文
      const tweetData = []
      for (let i = 0; i < 10; i++) {
        const tweet = {
          description: faker.lorem.sentence(),
          user_id: user.id,
          created_at: new Date(),
          updated_at: new Date()
        }
        tweetData.push(tweet)
      }
      // 新增每一位的 10 篇推文
      await queryInterface.bulkInsert('Tweets', tweetData)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
