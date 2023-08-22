const { User } = require('../models')
const randomUsersHelper = require('../helpers/randomUsersHelper');

const replyController = {
  getReplies: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);

      if (user) {
        const userData = user.toJSON();
        const tenRandomUsers = await randomUsersHelper.getTenRandomUsers(10); // 使用 helper 模块获取10个随机用户

        const dataToRender = {
          users: userData,
          recommend: tenRandomUsers,
        };

        res.render('user/user-replies', dataToRender);
      } else {
        res.status(404).send('未找到用户');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("获取用户数据时出错。");
    }
  }
  // getReplies: (req, res, next) => {
  //   return User.findByPk(req.params.id)
  //     .then(user => {
  //       return res.render('user/user-replies', {
  //         users: user.toJSON()
  //       })
  //     })
  // }
}

module.exports = replyController