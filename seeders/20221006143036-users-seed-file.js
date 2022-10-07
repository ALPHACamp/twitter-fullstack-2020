'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 50 }).map((_, i) =>
        ({
          name: `user${i}`,
          email: `user${i}@email.com`,
          password: bcrypt.hash('12345678', 10),
          account: `user${i}`,
          avatar: faker.image.cats(),
          cover: `https://loremflickr.com/630/200/landscape/?random=${Math.random() * 100}`,
          introduction: faker.lorem.text(max_nb_chars = 80),
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        }))
      , {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
}
