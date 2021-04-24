'use strict'
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'ROOT',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      name: 'root',
      avatar: 'https://cdn1.iconfinder.com/data/icons/gardening-flat-1/614/1417_-_Root-512.png',
      cover: 'https://cff2.earth.com/uploads/2019/08/01224933/How-plant-roots-know-to-follow-gravity-730x410.jpg',
      introduction: faker.lorem.text().substring(0, 30),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'USER1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user1',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
      cover: 'https://i.ytimg.com/vi/vxffHm4wy24/maxresdefault.jpg',
      introduction: faker.lorem.text().substring(0, 30),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'USER2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user2',
      avatar: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png',
      cover: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Junction_2.svg',
      introduction: faker.lorem.text().substring(0, 30),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'USER3',
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user3',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
      cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Bundesstra%C3%9Fe_3_number.svg/1200px-Bundesstra%C3%9Fe_3_number.svg.png',
      introduction: faker.lorem.text().substring(0, 30),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: '123123',
      email: '123@123',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: '123',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZagc7HK9K8xkgWG4exlEUiuLVHo252LD7ow&usqp=CAU',
      cover: 'https://i.ytimg.com/vi/DHV9ED5D_-I/maxresdefault.jpg',
      introduction: faker.lorem.text().substring(0, 30),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'actwitter',
      email: 'ac@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'AC',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9BI-IY4yLd_G6qba1o24WXjJQAAaugud7qQ&usqp=CAU',
      cover: 'https://yt3.ggpht.com/ytc/AAUvwni6ipOpW1ZorU_G9M_UiPq_68LoWoCJ334TXbfCaQ=s900-c-k-c0x00ffffff-no-rj',
      introduction: faker.lorem.text().substring(0, 30),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },

}