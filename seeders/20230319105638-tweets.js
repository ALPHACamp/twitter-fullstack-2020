'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface) => {
    // get an array which store { id: userId }
    const usersId = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE name != \'root\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // create Tweets array
    const fields = usersId.map(user => Array.from({ length: 10 }, () => (
      {
        UserId: user.id,
        description: faker.lorem.text().slice(0, 140),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ))).flat()
    await queryInterface.bulkInsert('Tweets', fields, {})
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
