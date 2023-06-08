'use strict'
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkInsert('Users', [{ 
      name: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      account:'root',
      introduction: faker.lorem.text().substring(0,50),
      role:'admin',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      account:'user1',
      introduction: faker.lorem.text().substring(0,50),
      role:'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      account:'user2',
      introduction: faker.lorem.text().substring(0,50),
      role:'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user3',
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      account:'user3',
      introduction: faker.lorem.text().substring(0,50),
      role:'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user4',
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      account:'user4',
      introduction: faker.lorem.text().substring(0,50),
      role:'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user5',
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      account:'user5',
      introduction: faker.lorem.text().substring(0,50),
      role:'user',
      created_at: new Date(),
      updated_at: new Date()
    },
  ], {});
    console.log('Users seeded successfully.');
    } 
    catch (error) {
      console.error('Error seeding users.', error);
    }
  },
  down: async (queryInterface, Sequelize) => { 
    try {
      await queryInterface.bulkDelete('Users', {});
      console.log('Users table reverted successfully.');
    } 
    catch (error) {
      console.error('Error reverting users table.', error);
    }
  }
}
