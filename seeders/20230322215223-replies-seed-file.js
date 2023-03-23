'use strict';
const faker = require('faker')
const { User, Tweet } = require('../models') // import User&Tweet model 因為回覆跟tweet貼文以及使用者都有關聯

module.exports = {
  up: async (queryInterface, Sequelize) => { 
    const replies = []  // 放一個空陣列來接回覆
    const tweets = await Tweet.findAll({ attributes: [ 'id' ] }) // 查找Tweet-model裡tweetId來關聯
    const users = await User.findAll({ // 查找User-model userId並且只有使用者身分
      raw: true,
      nest: true,
      where: { role: [ 'user' ] },
      attributes: [ 'id' ],
      raw: true
    })

    tweets.forEach(( tweet ) => { [0, 1, 2].forEach((i) => { //每則tweet推3則回覆
        replies.push({
          UserId: users[Math.floor(Math.random() * users.length)].id,
          comment: faker.lorem.sentence(),
          TweetId: tweet.id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
    })

    await queryInterface.bulkInsert('Replies', replies) // replies -> Replies-model 
  },

  down: async (queryInterface, Sequelize) => { // truncate偵錯到錯誤馬上暫停並顯示原因
    await queryInterface.bulkDelete('Replies', null, { truncate: true, restartIdentity: true })
  }
};
