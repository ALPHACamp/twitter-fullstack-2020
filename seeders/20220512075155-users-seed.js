'use strict';
const bcript = require('bcryptjs')
const faker = require('faker')
const userList = [{
  id: 1,
  email: 'root@example.com',
  account: 'root',
  name: 'root',
  password: bcript.hashSync('12345678',10),
  createdAt: new Date(),
  updatedAt: new Date(),
  role: 'admin',
  avatar: 'https://loremflickr.com/320/240/human',
  cover: 'https://loremflickr.com/320/240/',
  introduction: faker.lorem.text().slice(0,139)
}]
for(let i=0;i<5;i++){
  userList.push({
    id: i + 2,
    email: `user${i+1}@example.com`,
    account: `user${i+1}`,
    name: `user${i+1}`,
    password: bcript.hashSync('12345678',10),
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 'user',
    avatar: 'https://loremflickr.com/320/240/avatar',
    cover: 'https://loremflickr.com/320/240/scenery',
    introduction: faker.lorem.text().slice(0,139)
  })
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', userList, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {}) 
  }
};
