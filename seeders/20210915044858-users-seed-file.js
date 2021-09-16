'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      // password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      password: '12345678',
      name: 'root',
      avatar: `https://loremflickr.com/100/100/restaurant,food/?random=${Math.random() * 100}`,
      introduction: 'faker.lorem.text().substring(0, 160)',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, 
    {
      email: 'user1@example.com',
      password: '12345678',
      name: 'user1',
      avatar: `https://loremflickr.com/100/100/restaurant,food/?random=${Math.random() * 100}`,
      introduction: 'aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user2@example.com',
      password: '12345678',
      name: 'user2',
      avatar: `https://loremflickr.com/100/100/restaurant,food/?random=${Math.random() * 100}`,
      introduction: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user3@example.com',
      password: '12345678',
      name: 'user3',
      avatar: `https://loremflickr.com/100/100/restaurant,food/?random=${Math.random() * 100}`,
      introduction: ' sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user4@example.com',
      password: '12345678',
      name: 'user4',
      avatar: `https://loremflickr.com/100/100/restaurant,food/?random=${Math.random() * 100}`,
      introduction: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user5@example.com',
      password: '12345678',
      name: 'user5',
      avatar: `https://loremflickr.com/100/100/restaurant,food/?random=${Math.random() * 100}`,
      introduction: ' ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
