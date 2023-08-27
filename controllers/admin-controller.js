const { sequelize, Tweet, User, Like, Reply } = require('../models')

const adminController = {
  signinPage: (req, res) => {
    res.render('admin/signin')
  },
  signin: (req, res) => {
    if (req.user.role === 'user') {
      req.flash('account_messages', '帳號不存在！')
      res.redirect('/admin/signin')
    }
    res.redirect('/admin/tweets')
  },
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [
        User,
        Like,
        Reply
      ]
    })
      .then(Tweets => {
        const data = Tweets.map(tweet => {
          const newItem = tweet.toJSON();
          newItem.description = newItem.description.substring(0, 50)
          newItem.LikeCount = newItem.Likes.length;
          newItem.ReplyCount = newItem.Replies.length;
          return newItem;
        });
        res.render('admin/tweets', { tweets: data })
      })
  },
  deleteTweet: (req, res) => {
    const { tweetId } = req.params
    Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) {
          console.log('tweet不存在')
          res.redirect('back')
        }
        req.flash("success_messages", "刪除成功！");
        return tweet.destroy()
      })
      .then(() => res.redirect('/admin/tweets'))
  },
  getUsers: (req, res) => {
    User.findAll({
      include: [
        { model: Tweet, include: Like },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      order: [
        [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'DESC']
      ],
      where: { role: 'user' }
    })
      .then(users => {
        const data = users.map(user => {
          const newUser = user.toJSON()
          newUser.likeCount = newUser.Tweets.reduce((totalLikes, tweet) => {
            return totalLikes + tweet.Likes.length;
          }, 0)
          newUser.tweetCount = newUser.Tweets.length
          newUser.followingCount = newUser.Followings.length
          newUser.followerCount = newUser.Followers.length
          return newUser
        })
        res.render('admin/users', { users: data })
      })
  }
}

module.exports = adminController