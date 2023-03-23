'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker') //原套件faker壞了

const users = Array.from({ length: 5}).map((d, i)  => ({ //建立5個種子資料
  email: `user${i + 1}@example.com`,
  password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
  name:  `user${i + 1}`,
  avatar: `https://loremflickr.com/200/200/avatar/?lock=${i}`,
  introduction: faker.lorem.text(),
  role: 'user',
  account: `user${i + 1}`,
  cover:`https://loremflickr.com/250/240/landscape/?lock=${i}` ,
  created_at: new Date(),
  updated_at: new Date()
}))
users.unshift({ //建立固定的admin資料
  email: 'root@example.com',
  password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
  name:  'root',
  avatar: 'https://loremflickr.com/200/200/avatar/?lock=10',
  introduction: faker.lorem.text(),
  role: 'admin',
  account: 'root',
  cover:'https://loremflickr.com/250/240/landscape/?lock=33' ,
  created_at: new Date(),
  updated_at: new Date()
})

module.exports = { //從上面的users撈下來用
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', users,{})
  },
  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
