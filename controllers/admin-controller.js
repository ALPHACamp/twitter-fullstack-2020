const { Sequelize, sequelize, Tweet, User, Like, Reply, Followship } = require('../models')

const adminController = {
  signinPage: (req, res) => {
    res.render('admin/signin')
  },
  signin: (req, res) => {
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
  getUsers: (req, res) => {
    User.findAll({
      include: [
        { model: Tweet, include: Like },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      order: [
        [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'DESC']
      ]
    })
      .then(users => {
        const data = users.map(user => {
          const newUser = user.toJSON()
          newUser.likeCount = 0
          newUser.likeCount += newUser.Tweets.map(tweet => {
            return Number(tweet.Likes.length)
          })
          newUser.tweetCount = newUser.Tweets.length
          newUser.followingCount = newUser.Followings.length
          newUser.followerCount = newUser.Followers.length
          return newUser
        })
        console.log(data[0])
        res.render('admin/users', { users: data })
      })
  }
}

module.exports = adminController