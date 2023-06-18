'use strict'
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const users = [
        {
          name: 'root',
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
          account: 'root',
          introduction: faker.lorem.text().substring(0, 50),
          role: 'admin',
        },
        {
          name: 'user1',
          email: 'user1@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
          account: 'user1',
          avatar: 'https://www.giantbomb.com/a/uploads/scale_small/0/4024/570741-mrburns.gif',
          introduction: faker.lorem.text().substring(0, 50),
          role: 'user',
        },
        {
          name: 'Homer',
          email: 'Homer@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
          account: 'Homer',
          avatar: 'https://www.azcentral.com/gcdn/-mm-/fd5c5b5393c72a785789f0cd5bd20acedd2d2804/c=0-350-2659-1850/local/-/media/Phoenix/BillGoodykoontz/2014/04/24//1398388295000-Homer-Simpson.jpg?width=660&height=373&fit=crop&format=pjpg&auto=webp',
          introduction: faker.lorem.text().substring(0, 50),
          role: 'user',
        },
        {
          name: 'Marge',
          email: 'Marge@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
          account: 'Marge',
          avatar: 'https://images.immediate.co.uk/production/volatile/sites/3/2016/03/Simpsons_g2013_R1_marge-04bf0d1.jpg?quality=90&webp=true&crop=3px,170px,1884px,1255px&resize=1000,667',
          introduction: faker.lorem.text().substring(0, 50),
          role: 'user',
        },
        {
          name: 'Bart',
          email: 'Bart@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
          account: 'Bart',
          avatar: 'https://www.gyfted.me/_next/image?url=%2Fimg%2Fcharacters%2Fbart-simpson.png&w=256&q=75',
          introduction: faker.lorem.text().substring(0, 50),
          role: 'user',
        },
        {
          name: 'Lisa',
          email: 'Lisa@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
          account: 'Lisa',
          avatar: 'https://easydrawingguides.com/wp-content/uploads/2022/09/Easy-Lisa-Simpson.png',
          introduction: faker.lorem.text().substring(0, 50),
          role: 'user',
        },
      ];

      const delayInMinutes = 5;

      for (let i = 0; i < users.length; i++) {
        const createdAt = new Date(Date.now() + i * delayInMinutes * 60000).toISOString().substring(0, 16);

        users[i].created_at = createdAt;
        users[i].updated_at = createdAt;
      }

      await queryInterface.bulkInsert('Users', users, {});
      console.log('Users seeded successfully.');
    } catch (error) {
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
