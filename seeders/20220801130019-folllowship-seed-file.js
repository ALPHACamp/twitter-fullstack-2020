'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const users = await queryInterface.sequelize.query(
        'SELECT id FROM Users;',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      )
      users.splice(0, 1) // 拿掉管理員
      for (let user = 0; user < users.length; user++) {
        // 為每個使用者建立關係, 第0位
        const usersIndex = Array.from(Array(users.length).keys()) // 建立user對應的索引陣列 [0,1,2,3,4,]
        let followUserIndex = usersIndex.filter(index => Number(index) !== user) // 排除自己 [1,2,3,4]
        await queryInterface.bulkInsert(
          'Followships',
          Array.from(
            // 同一位使用者建立隨機數量關係，扣除追蹤自己
            { length: 3 },
            () => {
              // 隨機索引號碼 [1,2,3,4] 隨機一個索引號碼 假設 4
              const randomIndex =
                followUserIndex[
                  Math.floor(Math.random() * followUserIndex.length)
                ]
              console.log(`隨機引索: ${randomIndex}`)
              // 把已經加入過的索引剃除 剔除 4
              followUserIndex = followUserIndex.filter(
                index => index !== randomIndex
              )
              console.log(`更新後的引索: ${followUserIndex}`)
              // 宣告
              const followerId = users[user].id // 第0位使用者id
              console.log(`no. ${user}, followerId:${followerId}`)
              const followingId = users[randomIndex].id // 其他隨機使用者id(不包含自己跟管理員)
              console.log(`no. ${user}, followingId:${followingId}`)
              return {
                follower_id: followerId,
                following_id: followingId,
                created_at: new Date(),
                updated_at: new Date()
              }
            }
          )
        )
      }
    } catch (err) {
      console.log(err)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
