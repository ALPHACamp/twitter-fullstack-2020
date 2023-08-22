'use strict'
const bcrypt = require('bcryptjs')

const DEFAULT_AVATAR = 'https://i.imgur.com/FUerPDO.png'
const DEFAULT_BACKGROUND = 'https://i.imgur.com/IkTFZsQ.png'
const userCount = 20

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userPromises = [];

    // 創建管理用戶
    const adminHashedPassword = await bcrypt.hash('12345678', 10);
    const adminUser = {
      name: 'root',
      account: 'root',
      email: 'root@example.com',
      avatar: DEFAULT_AVATAR,
      background: DEFAULT_BACKGROUND,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      password: adminHashedPassword
    };
    userPromises.push(adminUser);

    // 創建基本用戶
    for (let i = 1; i <= userCount; i++) {
      const hashedPassword = await bcrypt.hash('12345678', 10);

      const user = {
        name: `user${i}`,
        account: `user${i}`,
        email: `user${i}@example.com`,
        avatar: DEFAULT_AVATAR,
        background: DEFAULT_BACKGROUND,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        password: hashedPassword
      };

      userPromises.push(user);
    }

    try {
      await queryInterface.bulkInsert('Users', userPromises)
    } catch (error) {
      console.error(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
