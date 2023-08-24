const { Tweet, User, Reply, Like, Followship } = require('../models')
const { getEightRandomUsers } = require("../helpers/randomUsersHelper");
const helpers = require('../_helpers')
const likeController = {
  getLikes: async (req, res, next) => {
    const isUser = helpers.getUser(req).id === Number(req.params.id) ? true : false
    try {
      const userId = req.params.id;
      const currentUserId = req.user.id;
      const user = await User.findByPk(userId,{
        include: [{
          model: Tweet,
          as: "LikedTweets",
          include: [
            { model: User },
            { model: Reply, include: [{ model: Tweet }] },
            { model: User, as: "LikedUsers" }
          ],
          order: [["updatedAt", "DESC"]]
        }]
      });

      if (user) {
        const userData = user.toJSON();
        const recommend = await getEightRandomUsers(req);
        
        const likedTweets = user.LikedTweets.map((likedTweet) => {
          const replies = likedTweet.Replies.length; 
          const likes = likedTweet.LikedUsers.length; 
          const isLiked = likedTweet.LikedUsers.some((l) => l.id === currentUserId);
          return {
            tweetId: likedTweet.id,
            userId: likedTweet.User.id,
            userAccount: likedTweet.User.account,
            userName: likedTweet.User.name,
            text: likedTweet.description,
            createdAt: likedTweet.createdAt,
            replies,
            likes,
            isLiked
          };
        });

        const dataToRender = {
          user: userData,
          likedTweets,
          recommend,
          isUser
        };

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