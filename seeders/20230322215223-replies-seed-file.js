'use strict';
const faker = require('faker')
const { User, Tweet } = require('../models') // import User&Tweet model 因為回覆跟tweet貼文以及使用者都有關聯

module.exports = {
  up: async (queryInterface, Sequelize) => { 
    await queryInterface.bulkInsert('Replies', Array.from({ length: 50 }).map((d, i) => ({
      User_id: [Math.floor(i / 10)],
      Tweet_id: [Math.floor(i / 10)],
      comment: faker.lorem.text(),
      created_at: new Date(),
      updated_at: new Date()
    })), {})
  },

  down: async (queryInterface, Sequelize) => { // truncate偵錯到錯誤馬上暫停並顯示原因
    await queryInterface.bulkDelete('Replies', null, { truncate: true, restartIdentity: true })
  }
};
