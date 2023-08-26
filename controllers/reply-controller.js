const { Tweet, User, Reply, Like, Followship } = require('../models')
const { getEightRandomUsers } = require("../helpers/randomUsersHelper");
const helpers = require('../_helpers')

const replyController = {
  getReplies: async (req, res, next) => {
    const isUser = helpers.getUser(req).id === Number(req.params.id) ? true : false
    try {
      const userId = req.params.id;
      const currentUserId = req.user.id;
      const user = await User.findByPk(userId,{
        include: [{ 
          model: Reply,include: [
            {model: Tweet, include: [{model: User}]},
            {model: User}],
          order: [['updatedAt', 'DESC']],
        }, 
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
      });

      if (user) {
        const userData = user.toJSON();
        const recommend = await getEightRandomUsers(req);
        const isFollowed = user.Followers.some((l) => l.id === currentUserId);
        const replies = user.Replies.map(reply => ({
          User: {
            account: reply.User.account,
            name: reply.User.name,
            id: reply.User.id,
            avatar: reply.User.avatar || 'https://i.imgur.com/ehh37fR.jpg'
          },
          Tweet:{
            userAvatar: reply.Tweet.User.avatar,
            username: reply.Tweet.User.name,
            userId: reply.Tweet.User.id,
            id: reply.Tweet.id
          },
          comment: reply.comment,
          createdAt: reply.createdAt
        }));
        const dataToRender = {
          user: userData,
          recommend,
          isUser,
          replies,
          isFollowed
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
}

module.exports = replyController