'use strict';
const faker = require('faker')
const { User, Tweet } = require('../models') // import User&Tweet model 因為回覆跟tweet貼文以及使用者都有關聯

module.exports = {
  up: async (queryInterface, Sequelize) => { 
    const replies =  [] // 放一個空陣列存放
    const tweets = await Tweet.findAll({ attributes: ['id'] }) // 關聯TweetId
    const users = await User.findAll({  // 關聯UserId,並且角色只能是user
      raw: true,
      nest: true,
      where: { role: 'user' },
      attributes: ['id']
    })
    
    tweets.forEach((tweet) => { // 一則tweet三筆回覆
      [0, 1, 2].forEach( i => {
        replies.push({
          UserId: users[Math.floor( Math.random() * users.length)].id,
          TweetId: tweet.id,
          comment: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
    })

    await queryInterface.bulkInsert('Replies', replies)  // 將 replies 推進 model.Replies
  },

  down: async (queryInterface, Sequelize) => { // truncate偵錯到錯誤馬上暫停並顯示原因
    await queryInterface.bulkDelete('Replies', null, { truncate: true, restartIdentity: true })
  }
};
