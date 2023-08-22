const {User} = require('../models'); // 根据你的项目结构导入 User 模型

// 随机获取指定数量的用户
async function getTenRandomUsers (count) {
  try {
    const users = await User.findAll({ raw: true });
    const tenRandomUsers = [];

    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * users.length);
      tenRandomUsers.push(users[index]);
    }

    return tenRandomUsers;
  } catch (err) {
    console.error(err);
    throw err; // 抛出错误以供调用方处理
  }
}

module.exports = {
  getTenRandomUsers,
};