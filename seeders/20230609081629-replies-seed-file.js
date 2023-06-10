'use strict'
const faker = require('faker')
//* 隨機排序ARRAY，並取出前N個，回傳成新的array
const getRandomItem = (array, num) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array.slice(0, num)
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 身分是user的用戶id取出來
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user"',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const replies = []
    // 確保每一個使用者都有回覆
    for (let i = 0; i < users.length; i++) {
      replies.push({
        user_id: users[i].id,
        tweet_id: getRandomItem(tweets, 1)[0].id,
        comment: faker.lorem.words(5),
        created_at: new Date(),
        updated_at: new Date()
      })
    }
    // 每一篇TWEET 都有3個回覆
    for (let tweet of tweets) {
      const randomUsers = getRandomItem(users, 3)
      for (let user of randomUsers) {
        replies.push({
          user_id: user.id,
          tweet_id: tweet.id,
          comment: faker.lorem.words(5),
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
