const helpers = require("../_helpers.js");
const db = require("../models");
const { Op } = require("sequelize");
const { User, Followship, sequelize, Tweet } = db;

//測試環境下經由helper取得使用者
const getTestUser = (req) => {
  if (process.env.NODE_ENV === "test") {
    return helpers.getUser(req);
  } else {
    return req.user;
  }
};

// 取得使用者的大頭與id
const getMyProfile = async (user) => {
  let myProfile = await User.findByPk(user.id, {
    attributes: ["id", "avatar"],
    raw: true
  });
  return myProfile;
};

// 取得右邊欄的熱門使用者
const getTopUsers = async (user) => {
  let datas = await User.findAll({
    attributes: ["id", "name", "account", "avatar"],
    include: [{ model: User, as: "Followers", attributes: ["id"] }],
    where: {
      id: { [Op.not]: user.id },
      role: { [Op.not]: "admin" }
    }
  });
  const topusers = datas
    .map((data) => ({
      ...data.dataValues,
      FollowerCount: data.Followers.length,
      isFollowed: user.Followings.map((d) => d.id).includes(data.id)
    }))
    .sort((a, b) => b.FollowerCount - a.FollowerCount)
    .slice(0, 10);
  return topusers;
};
module.exports = { getMyProfile, getTopUsers, getTestUser };
