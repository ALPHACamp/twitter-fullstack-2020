'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      name: 'root',
      account: '@root',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user1',
      account: '@user1',
      avatar: 'https://pickaface.net/gallery/avatar/unr_fake_190524_1549_9fgji7.png',
      cover: 'https://images.alphacoders.com/689/689223.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user2',
      account: '@user2',
      avatar: 'https://pickaface.net/gallery/avatar/20160625_050020_889_FAKE.png',
      cover: 'https://latavolalinen.com/wp-content/uploads/2015/08/mountains-rocks-colorado-british-columbia-alps-high-definition-wallpaper.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user3',
      account: '@user3',
      avatar: 'https://pickaface.net/gallery/avatar/Charlie123527d772fa51a7.png',
      cover: 'https://images2.alphacoders.com/719/719339.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user4',
      account: '@user4',
      avatar: 'https://pickaface.net/gallery/avatar/unr_adrian_180215_0407_2oo0yrq.png',
      cover: 'https://images.alphacoders.com/558/558963.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user5',
      account: '@user5',
      avatar: 'https://pickaface.net/gallery/avatar/ninas4001566c31994ff65.png',
      cover: 'https://images4.alphacoders.com/875/875696.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
    // .then((userId) => queryInterface.bulkInsert('Tweets',
    //   Array.from({ length: 50 }).map((item, index) =>
    //     ({
    //       UserId: (index % 5),
    //       description: faker.lorem.text(),
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     })
    //   ), {}))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
    // return queryInterface.bulkDelete('Tweets', null, {})
    //   .then(() => queryInterface.bulkDelete('Users', null, {}))

  }
};
