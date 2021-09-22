const db = require('../models')
const Followship = db.Followship
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')

const userService = require('../services/userService')

const userController = {
  getUserTweets: async (req, res) => {
    try {
      const userId = req.params.userId
      const popularUser = await userService.getPopular(req, res)
      const profileUser = await userService.getProfileUser(req, res)

      const tweetsRaw = await Tweet.findAll({
        where: { UserId: userId },
        include: [Reply, Like],
        order: [['createdAt', 'DESC']]
      })

      const tweets = tweetsRaw.map(tweet => ({
        ...tweet.dataValues,
        replyLength: tweet.Replies.length,
        likeLength: tweet.Likes.length,
        isLiked: req.user.LikedTweets.map(likeTweet => likeTweet.id).includes(
          tweet.id
        )
      }))

      res.render('userTweets', { profileUser, popularUser, tweets })
    } catch (err) {
      console.log(err)
      // req.flash('error_messages', '該使用者不存在')
      // res.redirect('/tweets')
    }
  },
  getSetting: async (req, res) => {
    try {
      User.findByPk(req.user.id, { raw: true }).then(user => {
        res.render('setting', { userdata: user })
      })
    } catch (error) {
      console.log(err)
      console.log('getSetting err')
    }
  },

  editSetting: async (req, res) => {
    try {
      const userId = req.user.id
      if (req.body.passwordCheck !== req.body.password) {
        req.flash('error_messages', '兩次密碼輸入不同！')
        return res.redirect('back')
      } else {
        User.findByPk(userId).then(user => {
          user
            .update({
              account: req.body.account,
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(
                req.body.password,
                bcrypt.genSaltSync(10),
                null
              )
            })
            .then(() => {
              req.flash('success_messages', '成功修改帳戶資料')
              res.redirect('back')
            })
        })
      }
    } catch (error) {
      console.log(err)
      console.log('getSetting err')
    }
  },

  getReplies: async (req, res) => {
    try {
      const userId = req.params.userId
      const popularUser = await userService.getPopular(req, res)
      const profileUser = await userService.getProfileUser(req, res)

      const replies = await Reply.findAll({
        where: { UserId: userId },
        include: [
          {
            model: Tweet,
            attributes: ['id'],
            include: [{ model: User, attributes: ['id', 'account'] }]
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      res.render('userReply', { profileUser, popularUser, replies })
    } catch (err) {
      console.log(err)
    }
  },
  getLikes: async (req, res) => {
    try {
      const userId = req.params.userId
      const popularUser = await userService.getPopular(req, res)
      const profileUser = await userService.getProfileUser(req, res)

      const likedTweetsRaw = await Like.findAll({
        where: { UserId: userId },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Tweet,
            attributes: ['description', 'createdAt', 'id'],
            include: [User, Like, Reply]
          }
        ]
      })

      const likedTweets = likedTweetsRaw.map(like => ({
        ...like.dataValues,
        replyLength: like.Tweet.Replies.length,
        likeLength: like.Tweet.Likes.length,
        isLiked: req.user.LikedTweets.map(likeTweet => likeTweet.id).includes(
          like.Tweet.id
        )
      }))

      res.render('userLike', { profileUser, popularUser, likedTweets })
    } catch (err) {
      console.log(err)
    }
  },

  getFollowings: async (req, res) => {
    try {
      const popularUser = await userService.getPopular(req, res)
      followerUser = popularUser.sort(
        (a, b) => b.FollowerCount - a.FollowerCount
      )

      return res.render('following', { popularUser })
    } catch (err) {
      console.log(err)
      console.log('getUserFollowers err')
      return res.redirect('back')
    }
  },

  getFollowers: async (req, res) => {
    try {
      // userId 為當前profile頁面的user的id
      const userId = req.params.userId
      const popularUser = await userService.getPopular(req, res)

      const followers = await Followship.findAll({
        //依追蹤時間排序追蹤者
        raw: true,
        nest: true,
        where: {
          followingId: req.user.id
        },
        order: [['createdAt', 'DESC']]
      })

      let Data = []

      Data = followers.map(async (item, index) => {
        // 整理 followers 資料
        let user = await User.findByPk(item.followerId)
        user = user.dataValues
        isFollowed = req.user.Followings.map(d => d.id).includes(user.id) // 判斷目前登入使用者是否已追蹤該 User 物件
        return {
          ...item.user,
          user,
          isFollowed
        }
      })

      Promise.all(Data).then(data => {
        return res.render('follower', { popularUser, data })
      })
    } catch (err) {
      console.log(err)
      console.log('getUserFollowers err')
      return res.redirect('back')
    }
  }
}

module.exports = userController
