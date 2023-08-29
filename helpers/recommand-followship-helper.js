const helpers = require('../_helpers')
const { Op } = require('sequelize')
const { User, sequelize } = require('../models')
/* 取出推薦的前10user */
const topFollowedUser = req => {
  return User.findAll({
    where: {
      id: { [Op.ne]: helpers.getUser(req).id }, // 不要出現登入帳號
      role: { [Op.ne]: 'admin' } // admin不推薦, ne = not
    },
    attributes: {
      include: [
      // 使用 sequelize.literal 創建一個 SQL 子查詢來計算帖子數量
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'], // User不要加s, 坑阿！
        // req.user是追別人的,  findAll的user是被追的人
        [sequelize.literal(
            `(SELECT COUNT(*) FROM Followships
              WHERE Followships.follower_id = ${helpers.getUser(req).id}
              AND Followships.following_id = User.id
            )`), 'isFollowed'] // 查看此User是否已追蹤
      ]
    },
    limit: 10,
    order: [['followerCount', 'DESC']],
    raw: true,
    nest: true
  })
}

module.exports = { topFollowedUser }
