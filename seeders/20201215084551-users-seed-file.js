'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: 1,
      name: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'root@example.com',
      avatar: 'https://images.dog.ceo/breeds/shiba/shiba-12.jpg',
      introduction: 'I\'m a cute dog, is it !? ',
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {})
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 5 }).map((d, i) =>
      ({
        id: (i + 1) * 10 + 1,
        name: faker.name.findName(),
        email: 'user' + String(i + 1) + '@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: 'user' + String(i + 1),
        avatar: `https://randomuser.me/api/portraits/${Math.floor(Math.random() * 2) === 0 ? 'women' : 'men'}/${Math.floor(Math.random() * 100)}.jpg`,
        introduction: faker.lorem.text(),
        role: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {})
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
};
