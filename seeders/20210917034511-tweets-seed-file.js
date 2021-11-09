'use strict';
const faker = require('faker')
const { User } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const people = await User.findAll({ attributes: ['id'] })
    const users = people.slice(1)
    await queryInterface.bulkInsert('Tweets', Array.from({ length: 50 }).map((d, i) => ({
      UserId: users[Math.floor(i / 10)].id,
      description: faker.lorem.text(),
      replyCount: 3,
      likeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, { truncate: true, restartIdentity: true })
  }
};
