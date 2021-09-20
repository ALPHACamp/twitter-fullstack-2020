const db = require('../models')
const moment = require('moment')

const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  getPosts: async (req, res) => {
    try {
      const rawTweets = await Tweet.findAll({
        include: [Reply, User,
          { model: User, as: 'LikedUsers' }],
        order: [['createdAt', 'DESC']],
        limit: 20
      })
      const Tweets = await rawTweets.map(data => ({
        ...data.dataValues,
        ReplyCount: data.Replies.length,
        LikedCount: data.LikedUsers.length,
        Replies: data.Replies.sort((a, b) => b.createdAt - a.createdAt),
        LikedUsers: data.LikedUsers.sort((a, b) => b.Like.createdAt - a.Like.createdAt),
        createdAt: moment(data.createdAt).fromNow()
      }))
      const rawUsers = await User.findAll({
        include: [
          { model: User, as: 'Followers' }
        ],
      })
      let Users = await rawUsers.map(data => ({
        ...data.dataValues,
        FollowerCount: data.Followers.length,
      }))
      Users = Users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      const TopUsers = Users.slice(0, 10)
      // return res.json(TopUsers)
      return res.render("index", { tweets: Tweets, users: TopUsers });
    } catch (error) {
      console.log(error)
    }
  },

  getPost: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        { model: User, as: 'LikedUsers' },
        { model: Reply, include: [User] }
      ]
    }).then(tweet => {
      const ReplyCount = tweet.Replies.length
      const LikedCount = tweet.LikedUsers.length
      Replies = tweet.Replies.sort((a, b) => b.createdAt - a.createdAt)
      LikedUsers = tweet.LikedUsers.sort((a, b) => b.Like.createdAt - a.Like.createdAt)
      return res.json({ tweet, ReplyCount, LikedCount })
    })
  },
  postTweet: (req, res) => {
    const { description } = req.body
    if (!description) {
      //req.flash('error_message', '你並未輸入任何文字')
      return res.redirect('back')
    }
    if (description.length > 140) {
      //req.flash('error_message', '你並未輸入任何文字')
      return res.redirect('back')
    }
    else {
      return Tweet.create({
        description
      })
        .then(() => {
          return res.redirect('/tweets')
        })
    }
  },
}
module.exports = tweetController