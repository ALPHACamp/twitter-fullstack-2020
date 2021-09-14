'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    //隨機建立30組likes (Condition:5位使用者,10個tweets)
    const likes = Array.from({ length: 30 }).map((d, i) =>
    ({
      userId: Math.floor(Math.random() * 5) + 2,
      tweetId: Math.floor(Math.random() * 20) + 1,
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
