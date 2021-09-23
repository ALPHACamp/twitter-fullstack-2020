'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    //隨機建立150組likes (Condition:5位使用者,50個tweets)
    const likes = Array.from({ length: 150 }).map((d, i) =>
    ({
      userId: Math.floor(Math.random() * 5)* 10 + 15,
      tweetId: Math.floor(Math.random() * 50)* 10 + 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    //刪除重複的objects
    const filteredLikes = likes.filter((e, i) => {
      return likes.findIndex((x) => {
        return x.userId == e.userId && x.tweetId == e.tweetId
      }) == i
    })

    return queryInterface.bulkInsert('Likes', filteredLikes, {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Likes', null, {})
  }
};
