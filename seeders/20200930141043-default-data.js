'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      name: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'root',
      cover: faker.image.imageUrl(),
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'user1',
      cover: faker.image.imageUrl(),
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map(b =>
        ({
          description: faker.lorem.text(),
          UserId: Math.floor(Math.random() * 2) + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})

    queryInterface.bulkInsert('Replies', [{
      comment: faker.lorem.text(),
      UserId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      comment: faker.lorem.text(),
      UserId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    return queryInterface.bulkInsert('Followships', [{
      followerId: '1',
      followingId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Tweets', null, {})
    queryInterface.bulkDelete('Replies', null, {})
    return queryInterface.bulkDelete('Followships', null, {})
  }
};
