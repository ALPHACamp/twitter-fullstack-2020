'use strict';
const faker = require('faker')
const { User, Tweet } = require('../models') // import User&Tweet model 因為回覆跟tweet貼文以及使用者都有關聯

module.exports = {
  up: async (queryInterface, Sequelize) => { 
    const tweets = await Tweet.findAll({ attributes: ['id'] }) // 關聯TweetId
    const users = await User.findAll({  // 關聯UserId,並且角色只能是user
      raw: true,
      nest: true,
      where: { role: 'user' },
      attributes: ['id']
    })

    for (const tweet of tweets) {
      const replies =  [] // 放一個空陣列存放
      for (let i =0 ; i < 3; i++){
        let randomUser
          do { //判斷UserId不重複則將資料推入replies陣列,重複則重來
          randomUser = users[Math.floor( Math.random() * users.length)].id
        }while (replies.some(r => r.UserId === randomUser)) // 運用some做單一判斷
          replies.push({
          UserId: randomUser ,
          TweetId: tweet.id,
          comment: faker.lorem.text().substring(0, 140), //字數限制
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      await queryInterface.bulkInsert('Replies', replies)  // 將 replies 推進 model.Replies
    }
  },

  down: async (queryInterface, Sequelize) => { // truncate偵錯到錯誤馬上暫停並顯示原因
    await queryInterface.bulkDelete('Replies', null, { truncate: true, restartIdentity: true })
  }
};
