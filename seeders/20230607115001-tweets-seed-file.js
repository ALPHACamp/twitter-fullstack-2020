'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const users = await
      queryInterface.sequelize.query(
        "SELECT * FROM `Users` WHERE `role` = 'user';",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
      await queryInterface.bulkInsert('Tweets', Array.from({ length: 50 }).map((d, i) => ({
        User_id: users[parseInt( i / 10 )].id,
        description: faker.lorem.text().substring(0,100),
        created_at: new Date(),
        updated_at: new Date()
      })), {});
    console.log('Tweets seeded successfully.');
    } 
    catch (error) {
      console.error('Error seeding tweets.', error);
    }
  },
  down: async (queryInterface, Sequelize) => { 
    try {
      await queryInterface.bulkDelete('Tweets', {});
      console.log('Tweets table reverted successfully.');
    } 
    catch (error) {
      console.error('Error reverting tweets table.', error);
    }
  }
}
