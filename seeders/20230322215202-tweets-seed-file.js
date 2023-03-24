'use strict';
const faker = require('faker')
const { User } = require('../models') // import User model

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userId = await User.findAll({ attributes: ['id'] }) //查找User-model的id欄位
    const users = userId.slice(1) // 扣掉管理員

    await queryInterface.bulkInsert('Tweets',Array.from({ length: 50 }).map((d, i) => ({
      UserId: users[Math.floor(i / 10)].id, // 平均分給5個使用者
      User_id: [Math.floor(i / 10)],
      description: faker.lorem.text(),
      created_at: new Date(),
      updated_at: new Date()
    })), {})
  },
  down: async (queryInterface, Sequelize) => { // truncate偵錯到錯誤馬上暫停並顯示原因
    await queryInterface.bulkDelete('Tweets', null, { truncate: true, restartIdentity: true })
  }
};

