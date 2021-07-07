'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      is_admin: true,
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date(),
      img: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      bg_img: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      description: 'Kylie is an interesting superhero who is addicted to skipping. She looks as though she has seen better days. Her top quality is that she is particularly educated. She is hiding a terrible secret concerning his boyfriend.',
    }, {
      account: 'User1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      is_admin: false,
      name: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      img: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      bg_img: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      description: 'An eighteen-year-old father is traumatised by the loss of his co-worker when he was ten. People often compare him to a supermodel. He strongly dislikes his girlfriend. He is striving to redeem himself after insulting Prince William on social media.',
    }, {
      account: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      is_admin: false,
      name: 'user2',
      createdAt: new Date(),
      updatedAt: new Date(),
      img: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      bg_img: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      description: 'Krista is a sweet man who finds it hard to put himself in other people s shoes. He usually wears a PVC apron. He strongly dislikes gazelle. He must use his talent for painting to heal the people around him before he can work on his own problems.',

    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}