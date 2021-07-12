'use strict';

const faker = require('faker')

// const getSmallSize = (text) => {
//   console.log('into getSmallSize...text', text)
//   console.log('into getSmallSize...typeof(text)', typeof (text))
//   return text.slice(0, 130)
// }

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((d, i) => ({
        id: i + 1,
        UserId: (i % 5) + 1,
        // UserId: Math.floor(Math.random() * 4) + 1,
        description: faker.lorem.text().slice(0, 130),
        createdAt: new Date(),
        updatedAt: new Date
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};