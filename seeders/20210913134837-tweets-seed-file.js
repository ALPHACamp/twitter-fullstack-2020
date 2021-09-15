'use strict';
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    //每個使用者有 10 篇 post (Condition:5位使用者)
    const posts = 10
    const users = 5
    let result = []
    Array.from({ length: posts }).map((d, i) => {
      const data = Array.from({ length: users }).map((d, i) =>
      ({
        UserId: i + 2,
        description: faker.lorem.paragraph(Math.floor(Math.random() * 3) + 1),
        createdAt: new Date(),
        updatedAt: new Date()
      })

      )
      return result.push(...data)
    })

    return queryInterface.bulkInsert('Tweets', result, {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', null, {})
  }
};
