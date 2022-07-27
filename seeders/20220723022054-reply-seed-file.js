'use strict'
const faker = require('faker')
const { User, Tweet } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersArray = await User.findAll({ where: { role: 'user' }, raw: true })
    const tweetArray = await Tweet.findAll({ raw: true })

    // 每一篇 tweet 需要有 3個不同 user 的 reply
    let repliesArray = []
    tweetArray.forEach(tweet => {
      // 使用 Set 來產生三位不同的 user
      const usersSet = new Set()
      while ([...usersSet].length < 3) {
        const User = usersArray[Math.floor(Math.random() * usersArray.length)]
        if (!usersSet.has(User)) usersSet.add(User)
      }

      // 產生每一個 reply 並放入 repliesArray中
      repliesArray = repliesArray.concat(
        Array.from({ length: 3 }, (value, index) => ({
          comment: faker.lorem.text().substring(0, 15),
          user_id: [...usersSet][index].id,
          Tweet_id: tweet.id,
          created_at: new Date(),
          updated_at: new Date()
        }))
      )
    })

    // 將 repliesArray 放入 Replies 資料庫中
    await queryInterface.bulkInsert('Replies', repliesArray)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
