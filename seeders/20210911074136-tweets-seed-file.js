'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let usersPosts = [] // 推文容器

    const users = Array.from({ length: 5 }).map((item, i) => ({
      UserId: (i + 1) * 10 + 5
    })) // {...UserId(2, 3, 4, 5, 6)}

    users.forEach((user, userIndex) => {
      // 每個使用者產生十則推文，每則推文回覆數為三、喜歡數為零(user, userIndex) = (2, )
      const posts = Array.from({ length: 10 }).map((post, postIndex) => ({
        id: userIndex * 10 + (postIndex + 1),
        UserId: user.UserId,
        description: faker.lorem.sentence(5, 139),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      
      // 存放推文到容器內
      usersPosts = usersPosts.concat(posts)
    })
    
    await queryInterface.bulkInsert('Tweets', usersPosts, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}