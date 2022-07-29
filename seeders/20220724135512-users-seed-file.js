'use strict'
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync(10)
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          account: 'root',
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', salt),
          name: 'root',
          avatar: `https://minimaltoolkit.com/images/randomdata/female/${Math.floor(Math.random() * 100) + 1}.jpg`,
          cover_photo: 'https://i.picsum.photos/id/1075/640/200.jpg?hmac=TsbMgNEREMcQYAXwB32bO6Jue2nb3xp1_xa_EcIiOFQ',
          introduction: 'isAdmin',
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: 'user1',
          email: 'user1@example.com',
          password: bcrypt.hashSync('12345678', salt),
          name: 'user_one',
          avatar: `https://minimaltoolkit.com/images/randomdata/male/${Math.floor(Math.random() * 100) + 1}.jpg`,
          cover_photo: 'https://i.picsum.photos/id/867/640/200.jpg?hmac=oEPAS2niXZXizvUbpvYOjR5J8JxdAvz-Rr_xpT9xQBw',
          introduction: faker.lorem.words(),
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: 'user2',
          email: 'user2@example.com',
          password: bcrypt.hashSync('12345678', salt),
          name: 'user_two',
          avatar: `https://minimaltoolkit.com/images/randomdata/female/${Math.floor(Math.random() * 100) + 1}.jpg`,
          cover_photo: 'https://i.picsum.photos/id/312/640/200.jpg?hmac=hlqdG1nN-Amxos9rxDPuKsUy47ueiBHwmJ90Mtci5ZM',
          introduction: faker.lorem.words(),
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: 'user3',
          email: 'user3@example.com',
          password: bcrypt.hashSync('12345678', salt),
          name: 'user_three',
          avatar: `https://minimaltoolkit.com/images/randomdata/female/${Math.floor(Math.random() * 100) + 1}.jpg`,
          cover_photo: 'https://i.picsum.photos/id/923/640/200.jpg?hmac=zAJVaqO8s6d5ytJ8m6NIcvwhoi3Ifx0tqe276eBLldM',
          introduction: faker.lorem.words(),
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: 'user4',
          email: 'user4@example.com',
          password: bcrypt.hashSync('12345678', salt),
          name: 'user_four',
          avatar: `https://minimaltoolkit.com/images/randomdata/male/${Math.floor(Math.random() * 100) + 1}.jpg`,
          cover_photo: 'https://i.picsum.photos/id/456/640/200.jpg?hmac=fl3SR9XJl4fAuw2uIhxPifMLQ6hbva70kkoUBfvOAJM',
          introduction: faker.lorem.words(),
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: 'user5',
          email: 'user5@example.com',
          password: bcrypt.hashSync('12345678', salt),
          name: 'user_five',
          avatar: `https://minimaltoolkit.com/images/randomdata/female/${Math.floor(Math.random() * 100) + 1}.jpg`,
          cover_photo: 'https://i.picsum.photos/id/480/640/200.jpg?hmac=L5TbU_95g3i0TiMkoqFEyH50TRgsm1INA-5_xx0rMSo',
          introduction: faker.lorem.words(),
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
