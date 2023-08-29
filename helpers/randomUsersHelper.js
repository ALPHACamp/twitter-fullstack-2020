const { User } = require("../models"); 
const { Op } = require("sequelize");
const helpers = require("../_helpers");

// 取得前八多追蹤人數的使用者
async function getEightRandomUsers(req) {
  try {
    const currentUserId = helpers.getUser(req).id;
    const users = await User.findAll({
      where: { id: { [Op.notIn]: [currentUserId] } }, //推薦清單排除跟自己
      include: [{ model: User, as: "Followers" }],
    });
    const usersWithoutAdmin = await users.filter((user) => {
      return user.dataValues.role !== "admin";
    }); //排除Admin
    const eightRandomUsers = usersWithoutAdmin
      .map((user) => {
        return {
          ...user.toJSON(),
          followerCount: user.Followers.length,
        };
      })
      .sort((a, b) => b.followerCount - a.followerCount)
      .slice(0, 8); //排序並取出前八
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
    return recommend;
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getEightRandomUsers,
};
