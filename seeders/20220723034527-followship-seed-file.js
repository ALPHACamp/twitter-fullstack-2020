'use strict'
const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersArray = await User.findAll({ where: { role: 'user' }, raw: true })

    const followshipsArray = []
    // 讓每位使用者對隨機 10位 不重複的 user 點 follow , 而且不能是自已
    usersArray.forEach((user, index) => {
      // randonUsers using deep copy
      const randonUsers = [...usersArray]
      // 將自已從 array 中移除
      randonUsers.splice(index, 1)
      for (let i = 0; i < 10; i++) {
        const randonNumber = Math.floor(Math.random() * randonUsers.length)
        followshipsArray.push({
          follower_id: user.id,
          following_id: randonUsers[randonNumber].id,
          created_at: new Date(),
          updated_at: new Date()
        })
        // 將使用者已經 follow 過的 user 從 randonUsers 中移除，避免產生重複 follow
        randonUsers.splice(randonNumber, 1)
      }
    })

    // 將 repliesArray 放入 Replies 資料庫中
    await queryInterface.bulkInsert('Followships', followshipsArray)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
