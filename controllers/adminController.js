const db = require('../models')
const { Reply, User, Tweet, Like, Followship } = db

const adminController = {
  signInPage: (req, res) => {
    return res.render("admin/signin");
  },

  signIn: (req, res) => {
    if (req.user.role === 'admin') {
      return res.redirect('/admin/tweets');
    }
    // req.flash('error_messages', '沒有權限');
    req.logout();
    return res.redirect('/signin');
  },
  signOut: (req, res) => {
    //  req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getPosts: (req, res) => {
    return Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      const data = tweets.map(t => ({
        ...t.dataValues,
        description: t.description.substring(0, 50),
      }))
      // return res.json(data)
      return res.render('admin/tweets', { tweet: data, isadmin: req.user.role })
    })
      .catch((error) => res.status(400).json(error));
  },

  deletePost: (req, res) => {
    return Tweet.findByPk(req.params.id).then((tweet) => {
      tweet.destroy().then(() => {
        // return res.json({ status: 'success', tweet })
        return res.redirect('/admin/tweets')
      })
    })
      .catch((error) => res.status(400).json(error));
  },

  getUsers: (req, res) => {
    return User.findAll({
      include: [
        Reply, Tweet, Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(users => {
      const data = users.map(data => ({
        ...data.dataValues,
        TweetCount: data.Tweets.length,
        ReplyCount: data.Replies.length,
        LikedCount: data.Likes.length,
        FollowersCount: data.Followers.length,
        FollowingsCount: data.Followings.length
      }))
      data.sort((a, b) => b.TweetCount - a.TweetCount)
      // return res.json(data)
      return res.render('admin/users', { user: data, isadmin: req.user.role})
    })
      .catch((error) => res.status(400).json(error));
  }
}

module.exports = adminController