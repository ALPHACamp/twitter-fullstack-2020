'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      account: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://randomuser.me/api/portraits/men/88.jpg',
      introduction: faker.lorem.text().substring(0, 160),
      banner: 'https://upload.cc/i1/2022/07/26/CE3yXw.png',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user1',
      account: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      introduction: faker.lorem.text().substring(0, 160),
      banner: 'https://upload.cc/i1/2022/07/26/CE3yXw.png',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user2',
      account: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
      introduction: faker.lorem.text().substring(0, 160),
      banner: 'https://upload.cc/i1/2022/07/26/CE3yXw.png',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user3',
      account: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://randomuser.me/api/portraits/women/19.jpg',
      introduction: faker.lorem.text().substring(0, 160),
      banner: 'https://upload.cc/i1/2022/07/26/CE3yXw.png',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user4',
      account: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://randomuser.me/api/portraits/women/20.jpg',
      introduction: faker.lorem.text().substring(0, 160),
      banner: 'https://upload.cc/i1/2022/07/26/CE3yXw.png',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user5',
      account: 'user5',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://randomuser.me/api/portraits/men/17.jpg',
      introduction: faker.lorem.text().substring(0, 160),
      banner: 'https://upload.cc/i1/2022/07/26/CE3yXw.png',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user6',
      account: 'user6',
      email: 'user6@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://randomuser.me/api/portraits/men/30.jpg',
      introduction: faker.lorem.text().substring(0, 160),
      banner: 'https://upload.cc/i1/2022/07/26/CE3yXw.png',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user7',
      account: 'user7',
      email: 'user7@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
      introduction: faker.lorem.text().substring(0, 160),
      banner: 'https://upload.cc/i1/2022/07/26/CE3yXw.png',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user8',
      account: 'user8',
      email: 'user8@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
      introduction: faker.lorem.text().substring(0, 160),
      banner: 'https://upload.cc/i1/2022/07/26/CE3yXw.png',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user9',
      account: 'user9',
      email: 'user9@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      introduction: faker.lorem.text().substring(0, 160),
      banner: 'https://upload.cc/i1/2022/07/26/CE3yXw.png',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user10',
      account: 'user10',
      email: 'user10@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://randomuser.me/api/portraits/men/80.jpg',
      introduction: faker.lorem.text().substring(0, 160),
      banner: 'https://upload.cc/i1/2022/07/26/CE3yXw.png',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
