'use strict'
const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 只選出user(不包含admin)
    const users = await User.findAll({ where: { role: 'user' }, raw: true })
    const followshipArr = []
    // 每一個使用者隨機按讚

    // 使用者
    users.forEach((user, index) => {
      // 展開users
      const usersArr = [...users]
      usersArr.splice(index, 1)
      for (let i = 0; i < usersArr.length; i++) {
        // 隨機數字->tweet
        const randomNumber = Math.floor(Math.random() * usersArr.length)
        followshipArr.push({
          follower_id: user.id,
          following_id: usersArr[randomNumber].id,
          created_at: new Date(),
          updated_at: new Date()
        })
        usersArr.splice(randomNumber, 1)
      }
    })
    await queryInterface.bulkInsert('Followships', followshipArr, {})
  },

  down: (queryInterface, Sequelize) => {

  }
}
