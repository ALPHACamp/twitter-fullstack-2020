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
            {model: User}]
        }, 
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
        order: [["Replies", "updatedAt", "DESC"]]
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
        req.flash('error_messages', '未找到用戶')
        res.redirect('back')
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController