'use strict';
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    //每篇 post 有隨機 3 個留言者，留言者不重複 (Condition:5位使用者, 50個tweets, 每篇 tweets 3個留言者)
    const totalUsers = 5
    const totalTweets = 50
    let commentedUsers = []
    let result = []

    for (let i = 1; i < totalTweets + 1; i++) {
      const nums = new Set()
      while (nums.size !== 3) {
        nums.add(Math.floor(Math.random() * totalUsers) + 2)
      }
      commentedUsers.push(...nums)
    }

    const reply1 = commentedUsers.filter((v, i) => i % 3 === 0)
    const reply2 = commentedUsers.filter((v, i) => i % 3 === 1)
    const reply3 = commentedUsers.filter((v, i) => i % 3 === 2)

    const data1 = reply1.map((d, i) => ({
      UserId: d,
      TweetId: i + 1,
      comment: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    result.push(...data1)

    const data2 = reply2.map((d, i) => ({
      UserId: d,
      TweetId: i + 1,
      comment: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    result.push(...data2)

    const data3 = reply3.map((d, i) => ({
      UserId: d,
      TweetId: i + 1,
      comment: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    result.push(...data3)

    return queryInterface.bulkInsert('Replies', result, {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Replies', null, {})
  }
};
