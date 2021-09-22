'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let replies = []
    const TWEET_NUM = 50 // 推文總數
    const REPLY_PER_POST = 3 // 每則推文的回覆數
    const TOTAL_USER = 5 // 使用者總數

    const tweets = Array.from({ length: TWEET_NUM }).map((item, i) => ({
      id: i + 1
    }))

    const userPool = Array.from({ length: TOTAL_USER }).map((_, index) => index + 1)

    tweets.forEach((tweet, tweetIndex) => {
      const userRandomPool = unrepeatedArray(REPLY_PER_POST, userPool)

      const tempReplies = Array.from({ length: REPLY_PER_POST }).map((reply, replyIndex) => ({
        id: tweetIndex * REPLY_PER_POST + (replyIndex + 1),
        UserId: userRandomPool[replyIndex],
        TweetId: tweet.id,
        comment: faker.lorem.sentence(139),
        createdAt: new Date(),
        updatedAt: new Date()
      }))

      // 函式確認沒有重複回覆後加入容器
      replies = replies.concat(tempReplies)
    })

    await queryInterface.bulkInsert('Replies', replies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}

// 不重複回覆推文
function unrepeatedArray(indexNeed, array) {
  const tempArr = [...array]
  let result = []

  for (let i = 0; i < indexNeed; i++) {
    // ~~ 是 Math.floor的縮寫，效能比較高
    const randomIndex = ~~(Math.random() * tempArr.length)
    const choice = tempArr[randomIndex]

    result.push(choice)

    tempArr[randomIndex] = tempArr[tempArr.length - 1]
    tempArr[tempArr.length - 1] = choice

    tempArr.pop()
  }

  return result
}