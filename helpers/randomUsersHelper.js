const {User} = require('../models'); // 根据你的项目结构导入 User 模型
const { Sequelize, Op } = require("sequelize");
const helpers = require("../_helpers");

// 随机获取指定数量的用户
async function getEightRandomUsers (req) {
  try {
    const currentUserId = helpers.getUser(req).id;
    const eightRandomUsers = await User.findAll({
      where: { id: { [Op.notIn]: [1, currentUserId] } }, //推薦清單排除第一個root跟自己  修改:用role判斷isAdmin在哪
      include: [{ model: User, as: "Followers" }],
      order: Sequelize.literal("RAND()"), // 隨機排序
      limit: 8, // 取 8 筆資料
    });
    const recommend = eightRandomUsers.map((user) => {
      const isFollowed = user.Followers.some(
        (follower) => follower.id === currentUserId
      );
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        account: user.account,
        isFollowed,
      };
    });
    return recommend
  } catch (err) {
    console.error(err);
    throw err; // 抛出错误以供调用方处理
  }
}

module.exports = {
  getEightRandomUsers,
};