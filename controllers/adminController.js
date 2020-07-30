const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Followships = db.Followships
const Reply = db.Reply
const Like = db.Like


let adminController = {
  adminLoginPage: (req, res) => {
    return res.render('admin/login');
  },
  login: (req, res) => {
    req.flash('success_messages', 'Login successfully');
    res.redirect('/admin/tweets');
  },
  getTweets: (req, res) => {
    Tweet.findAll({ raw: true, nest: true, include: User }).then((tweets) => {
      const data = tweets.map((r) => ({
        ...r,
        userName: r.User.name,
        userAvatar: r.User.avatar,
        description: r.description.substring(0, 50),
        createdA: r.createdAt
      }))
      return res.render('admin/tweetsHome', { tweets: data })
    })
  },

  getUsers: async (req, res) => {

    let users = await User.findAll({
      include: [
        Tweet,
        { model: Tweet, as: 'userLike' },
        { model: Tweet, as: 'UserReply' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    })  
      data = users.map(r => ({
        ...r.dataValues,
        LikeCount: r.userLike.length,
        ReplyCount: r.UserReply.length,
        FollowerCount: r.Followers.length,
        FollowingCount: r.Followings.length,
        TweetCount: r.Tweets.length
      }))      
      data = data.sort((a, b) => (b.TweetCount - a.TweetCount))
      res.render('admin/tweetsUser', { users: data })
    
  },

  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.id).then((Tweet) => {
      Tweet.destroy().then((Tweet) => {
        req.flash('success_messages', '刪除成功！');
        return res.redirect('/admin/tweets');
      });
    });
  }
};



module.exports = adminController;
