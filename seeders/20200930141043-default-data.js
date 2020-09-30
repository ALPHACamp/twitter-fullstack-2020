'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      name: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'user1',
      cover: faker.image.image,
      avatar: faker.image.avatar,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'user2',
      introduction: faker.lorem.paragraph,
      avatar: faker.image.avatar,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    queryInterface.bulkInsert('Tweets', [{
      description: faker.lorem.paragraph,
      UserId: '1'
    },{
      description: faker.lorem.paragraph,
      UserId: '2'
    }], {});

    queryInterface.bulkInsert('Replys', [{
      comment: faker.lorem.paragraph,
      UserId: '1'
    },{
      comment: faker.lorem.paragraph,
      UserId: '2'
    }], {});

    return queryInterface.bulkInsert('Followships', [{
      followerId: '1',
      followingId: '2'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Tweets', null, {})
    queryInterface.bulkDelete('Replys', null, {})
    queryInterface.bulkDelete('Followships', null, {})
  }
};
