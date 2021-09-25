const bcrypt = require('bcrypt-nodejs')
const { authenticate } = require('passport')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship

const pageLimit = 10

const adminController = {
  getLogin: (req, res) => {
    return res.render('adminLogin', { layout: "userMain" })
  },

  postLogin: (req, res) => {
    res.redirect('/admin/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/admin/signin')
  },

  getTweets: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    return Tweet.findAndCountAll({
      include: [User],
      offset,
      limit: pageLimit
    }).then(result => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(t => ({
        ...t.dataValues,
        description: t.dataValues.description.substring(0, 50),
        avatar: t.User.avatar,
        account: t.User.account,
        name: t.User.name
      }))
      return res.render('adminTweets', {
        layout: 'adminMain',
        tweets: data,
        page,
        totalPage,
        prev,
        next
      })
    })
  },

  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        tweet.destroy()
          .then(() => {
            res.redirect('/admin/tweets')
          })
      })
  },

  getUsers: (req, res) => {
    return User.findAll({
      where: { isAdmin: 'false' },
      include: [Like, Reply]
    }).then(users => {
      // get user id
      const userId = {
        user1: users[0].id,
        user2: users[1].id,
        user3: users[2].id,
        user4: users[3].id,
        user5: users[4].id
      }

      Followship.findAll({
        raw: true,
        nest: true
      }).then(result => {
        const followerCount = [0, 0, 0, 0, 0]
        const followingCount = [0, 0, 0, 0, 0]

        // count follower
        result.forEach((r, i) => {
          if (r.followerId === userId.user1) {
            followerCount[0] += 1
          } else if (r.followerId === userId.user2) {
            followerCount[1] += 1
          } else if (r.followerId === userId.user3) {
            followerCount[2] += 1
          } else if (r.followerId === userId.user4) {
            followerCount[3] += 1
          } else if (r.followerId === userId.user5) {
            followerCount[4] += 1
          }
        })
        // count following
        result.forEach((r, i) => {
          if (r.followingId === userId.user1) {
            followingCount[0] += 1
          } else if (r.followingId === userId.user2) {
            followingCount[1] += 1
          } else if (r.followingId === userId.user3) {
            followingCount[2] += 1
          } else if (r.followingId === userId.user4) {
            followingCount[3] += 1
          } else if (r.followingId === userId.user5) {
            followingCount[4] += 1
          }
        })

        const usersData = users.map((u, i) => ({
          ...u.dataValues,
          likeCount: users[i].Likes.length,
          replyCount: users[i].Replies.length,
          followerCount: followerCount[i],
          followingCount: followingCount[i]
        }))

        return res.render('adminUsers', {
          layout: 'adminMain',
          users: usersData
        })
      })
    })
  }
}

module.exports = adminController