'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    //隨機建立20組followship (Condition:5位使用者)
    const followship = Array.from({ length: 20 }).map((d, i) =>
    ({
      followerId: Math.floor(Math.random() * 5) * 10 + 15,
      followingId: Math.floor(Math.random() * 5) * 10 + 15,
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    //不能追蹤自己，故移除followerId =followingId
    const filteredFollowship = followship.filter(({ followerId, followingId }) => followerId !== followingId)

    //移除重複的objects
    const cleanFollowship = filteredFollowship.filter((e, i) => {
      return filteredFollowship.findIndex((x) => {
        return x.followerId == e.followerId && x.followingId == e.followingId
      }) == i
    })
    
    return queryInterface.bulkInsert('Followships', cleanFollowship, {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Followships', null, {})
  }
}