'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker') //原套件faker壞了

const users = Array.from({ length: 5 }).map((d, i)  => ({ //建立5個種子資料
  email: `user${i + 1}@example.com`,
  password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
  name:  `user${i + 1}`,
  avatar: `https://i.imgur.com/ehh37fR.jpg`,
  introduction: faker.lorem.text().substring(0, 160),
  role: 'user',
  account: `user${i + 1}`,
  cover:`https://i.imgur.com/ndXEE6d.jpg` ,
  createdAt: new Date(),
  updatedAt: new Date()
}))
users.unshift({ //建立固定的管理員資料
  email: 'root@example.com',
  password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
  name:  'root',
  avatar: 'https://i.imgur.com/ehh37fR.jpg',
  introduction: faker.lorem.text().substring(0, 160),
  role: 'admin',
  account: 'root',
  cover:'https://i.imgur.com/ndXEE6d.jpg' ,
  createdAt: new Date(),
  updatedAt: new Date()
})

module.exports = { //從上面的users撈下來用
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', users,{})
  },
  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
