'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const [users, tweets] = await Promise.all([
        queryInterface.sequelize.query(
          "SELECT id FROM Users;",
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        ),
        queryInterface.sequelize.query(
          "SELECT id FROM Tweets;",
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        )
      ])

      await queryInterface.bulkInsert('Replies', Array.from({ length: 150 }).map((d, i) => ({
        User_id: users[i % 5].id,
        Tweet_id: tweets[parseInt(i / 3)].id,
        comment: faker.lorem.text().substring(0, 80),
        created_at: new Date(),
        updated_at: new Date()
      })), {});
      console.log('Replies seeded successfully.');
    }
    catch (error) {
      console.error('Error seeding replies.', error);
    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Replies', {});
      console.log('Replies table reverted successfully.');
    }
    catch (error) {
      console.error('Error reverting replies table.', error);
    }
  }
}
