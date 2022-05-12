'use strict';
const bcript = require('bcryptjs')
const userList = [{
  email: 'root@example.com',
  name: 'root',
  password: bcript.hashSync('12345678',10),
  createdAt: new Date(),
  updatedAt: new Date(),
  role: 'admin'
}]
for(let i=0;i<5;i++){
  userList.push({
    email: `user${i+1}@example.com`,
    name: `user${i+1}`,
    password: bcript.hashSync('12345678',10),
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 'user'
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
