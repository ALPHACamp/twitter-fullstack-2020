'use strict'
const { User, Tweet } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersArray = await User.findAll({ where: { role: 'user' }, raw: true })
    const tweetArray = await Tweet.findAll({ raw: true })

    const likesArray = []
    // 讓每位使用者對隨機 10 篇不重複的 Tweet 點 like
    usersArray.forEach(user => {
      // randonTweet using deep copy
      const randonTweet = [...tweetArray]
      for (let i = 0; i < 10; i++) {
        const randonNumber = Math.floor(Math.random() * randonTweet.length)
        likesArray.push({
          user_id: user.id,
          Tweet_id: randonTweet[randonNumber].id,
          created_at: new Date(),
          updated_at: new Date()
        })
        // 將使用者已經 like 過的 Tweet 從 randonTweet 中移除，避免產生重複 like
        randonTweet.splice(randonNumber, 1)
      }
    })

    // 將 repliesArray 放入 Replies 資料庫中
    await queryInterface.bulkInsert('Likes', likesArray)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
