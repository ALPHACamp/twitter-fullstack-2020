const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const Followship = db.Followship

const helpers = require('../_helpers')
const { Op } = require("sequelize")
const sequelize = require('sequelize')

const tweetService = {
  getTweets: async (req, res, callback) => {
    const tweets = await Tweet.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'avatar', 'account']
        },
        { model: Like },
        { model: Reply }
      ],
      order: [['createdAt', 'DESC'],
      ]
    })

    // 在 followship 內新增 count 屬性 
    // 利用 SQL 原生函式COUNT 以 followship 內的followingId欄位計算數量
    const users = await Followship.findAll({
      attributes: [
        'followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']
      ],
      include: [
        { model: User, as: 'FollowingLinks' },
      ],
      group: ['followingId'],
      order: [[sequelize.col('count'), 'DESC']],
      limit: 10
    })
    // name, account : 限制在popular中呈現的字數

    const currentUser = helpers.getUser(req)
    const topUsers = users.map(user => ({
      id: user.FollowingLinks.id,
      name: user.FollowingLinks.name ? (user.FollowingLinks.name.length > 12 ? user.FollowingLinks.name.substring(0, 12) + '...' : user.FollowingLinks.name) : 'noName',
      account: user.FollowingLinks.account ? (user.FollowingLinks.account.length > 12 ? user.FollowingLinks.account.substring(0, 12) + '..' : user.FollowingLinks.account) : 'noAccount',
      avatar: user.FollowingLinks.avatar,
      followerCount: user.count,
      isFollowed: currentUser.Followings.map((d) => d.id).includes(user.FollowingLinks.id),
      isSelf: Boolean(user.FollowingLinks.id === currentUser.id)
    }))

    const tweetsData = await tweets.map(tweet => ({
      ...tweet.dataValues,
      User: tweet.User.dataValues,
      isLiked: tweet.Likes.map(d => d.UserId).includes(helpers.getUser(req).id)
    }))

    return callback({
      tweets: tweetsData,
      topUsers,
      currentUser
    })
  },

  postTweet: async (req, res) => {
    let { description } = req.body
    if (!description.trim()) {
      req.flash('error_messages', '推文不能空白！')
      return res.redirect('back')
    }
    if (description.length > 140) {
      req.flash('error_messages', '推文不能為超過140字！')
      return res.redirect('back')
    }
    await Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id
    })
    res.redirect('/tweets')
  }
}

module.exports = tweetService