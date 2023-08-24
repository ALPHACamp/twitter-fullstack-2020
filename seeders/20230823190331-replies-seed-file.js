'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const repliesSeederData = []
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE account <> "root";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    function generateReply (userId, tweetId) {
      return {
        User_id: userId,
        Tweet_id: tweetId,
        comment: faker.lorem.text().substring(0, 50),
        created_at: new Date(),
        updated_at: new Date()
      }
    }
    function getRandomUserId () {
      return users[Math.floor(Math.random() * users.length)].id
    }
    // 將前 10 個推文分配給不同的使用者留言，確保每個人有一個留言，另外兩個留言隨機分配
    for (let i = 0; i < 10; i++) {
      repliesSeederData.push(generateReply(users[i].id, tweets[i].id))
      repliesSeederData.push(generateReply(getRandomUserId(), tweets[i].id))
      repliesSeederData.push(generateReply(getRandomUserId(), tweets[i].id))
    }
    // 剩下的 90 篇推文再隨機分配給 3 個使用者
    for (let i = 10; i < tweets.length; i++) {
      repliesSeederData.push(generateReply(getRandomUserId(), tweets[i].id))
      repliesSeederData.push(generateReply(getRandomUserId(), tweets[i].id))
      repliesSeederData.push(generateReply(getRandomUserId(), tweets[i].id))
    }
    await queryInterface.bulkInsert('Replies', repliesSeederData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
