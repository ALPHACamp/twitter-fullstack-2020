'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 身分是user的用戶id取出來
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user"',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const tweets = []
    // 每個使用者都要新增推文
    for (let user of users) {
      // 每個使用者都新增10則推文
      for (let i = 0; i < 10; i++) {
        tweets.push({
          description: faker.lorem.words(5),
          user_id: user.id,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Tweets', tweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
