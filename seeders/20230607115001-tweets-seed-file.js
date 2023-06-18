'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const users = await
      queryInterface.sequelize.query(
        "SELECT id FROM Users WHERE `role` = 'user';",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
      const delayInMinutes = 5; 
      const tweetCount = 50;
      const tweets = [];

      for (let i = 0; i < tweetCount; i++) {
        const userIndex = parseInt(i / 10);
        const createdAt = new Date(Date.now() + i * delayInMinutes * 60000).toISOString().substring(0, 16);

        tweets.push({
          User_id: users[userIndex].id,
          description: faker.lorem.text().substring(0, 100),
          created_at: createdAt,
          updated_at: createdAt
        });
      }
      await queryInterface.bulkInsert('Tweets', tweets, {});
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
