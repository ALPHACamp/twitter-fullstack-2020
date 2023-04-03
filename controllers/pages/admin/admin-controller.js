const { User, Tweet, Like } = require('../../../models')
const bcrypt = require('bcryptjs') //載入 bcrypt
const helpers = require('../../../_helpers')
const Handlebars = require('handlebars')
const { Op } = require('sequelize');
const abbreviateNumber = require('../../../helpers/abbreviateNumber')

Handlebars.registerHelper('relativeTime', function (value) {
  const date = new Date();
  const timestamp = date.getTime();
  const seconds = Math.floor(timestamp / 1000);
  const valueTimestamp = value.getTime();
  const valueSeconds = Math.floor(valueTimestamp / 1000);
  const difference = seconds - valueSeconds;
  let output = ``;
  if (difference < 60) {

    output = `${difference} seconds ago`;
  } else if (difference < 3600) {
    output = `${Math.floor(difference / 60)} 分鐘`;
  } else if (difference < 86400) {
    output = `${Math.floor(difference / 3600)} 小時`;
  } else if (difference < 2620800) {
    output = `${Math.floor(difference / 86400)} 天`;
  } else if (difference < 31449600) {
    output = `${Math.floor(difference / 2620800)} 月`;
  } else {
    output = `${Math.floor(difference / 31449600)} 年`;
  }

  return output;
});

const adminController = {
  adminSignInPage: (req, res) => {
    return res.render('admin/signin', {layout: 'signin-main'})
  },

  adminSignIn: (req, res) => {
    req.flash('success_messages', '後台成功登入！')
    res.redirect('/admin/tweets')
  },

  adminTweets: async (req, res) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        tweets.forEach(tweet => tweet.description = tweet.description.slice(0, 50))
        res.render('admin/tweets', { tweets, isTweets: true, layout: 'admin-main' })
      })
      .catch(err => next(err))
  },

  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweets => {
        if (!tweets) throw new Error("tweets didn't exist!")
        return tweets.destroy()
      })
      .then(() => res.redirect('/admin/tweets'))
      .catch(err => next(err))
  },

  adminUsers: (req, res, next) => {
    User.findAll({
      where: {
        role: null
      },
      include: [
        { model: Tweet, include: { model: Like } },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    })
      .then(users => {
        const result = users.map(user => ({
          ...user.toJSON(),
          tweetCount: user.Tweets.length,
          likeCount:
            abbreviateNumber(user.Tweets.reduce((totalLikes, tweet) => { return totalLikes + tweet.Likes.length }, 0)),
          followerCount: user.Followers.length,
          followingCount: user.Followings.length
        }))
        res.render('admin/users', { users: result, isUsers: true, layout: 'admin-main' })
      })
      .catch(err => next(err))
  }

}
module.exports = adminController