const { Tweet, User, Reply, Like, Followship } = require('../models')
const { getEightRandomUsers } = require("../helpers/randomUsersHelper");
const helpers = require('../_helpers')
const likeController = {
  getLikes: async (req, res, next) => {
    const isUser = helpers.getUser(req).id === Number(req.params.id) ? true : false
    try {
      const userId = req.params.id;
      const currentUserId = helpers.getUser(req).id;
      const user = await User.findByPk(userId,{
        include: [{
          model: Like,
          include: [{ model: Tweet,
            include:[User, Like, Reply]}
          ]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
        order: [["Likes","updatedAt", "DESC"]]
      });

      if (user) {
        const userData = user.toJSON();
        const recommend = await getEightRandomUsers(req);
        const isFollowed = user.Followers.some((l) => l.id === currentUserId);
        const likedTweets = user.Likes.map(e => {
          const replies = e.Tweet.Replies.length
          const likes= e.Tweet.Likes.length
          const isLiked = e.Tweet.Likes.some(l => l.UserId === currentUserId)
          const userAvatar = e.Tweet.User.avatar;
          return {
            tweetId: e.Tweet.id,
            userId: e.Tweet.User.id,
            userAccount: e.Tweet.User.account,
            userName: e.Tweet.User.name,
            text: e.Tweet.description,
            createdAt: e.Tweet.createdAt,
            replies,
            likes,
            isLiked,
            userAvatar
          }
        })
        const dataToRender = {
          user: userData,
          likedTweets,
          recommend,
          isUser,
          isFollowed
        };
        console.log(likedTweets)
        res.render('user/user-likes', dataToRender);
      } else {
        res.status(404).send('未找到用户');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("获取用户数据时出错。");
    }
  }
}

module.exports = likeController