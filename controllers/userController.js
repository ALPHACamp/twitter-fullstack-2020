const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID


const userController = {
  getSignup: (req, res) => {
    return res.render('signup', { layout: 'userMain' })
  },

  postSignup: (req, res) => {
    if (req.body.password !== req.body.confirmPassword) {
      req.flash('error_messages', '兩次密碼輸入不符！')
      res.redirect('/users/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '此信箱已註冊過！')
            res.redirect('/users/signup')
          } else {
            User.create({
              account: req.body.account,
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              req.flash('success_messages', '註冊成功！')
              return res.redirect('/users/login')
            })
          }
        })
    }
  },

  getLogin: (req, res) => {
    return res.render('userLogin', { layout: 'userMain' })
  },

  postLogin: (req, res) => {
    res.redirect('/twitters')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/users/login')
  },

  getUser: (req, res) => {
    const whereQuery = {}
    whereQuery.userId = Number(req.params.id)

    Tweet.findAndCountAll({
      include: [
        User,
        Reply,
        Like
      ],
      where: whereQuery,
      order: [['createdAt', 'DESC']],
    }).then(result => {
      const totalTweet = result.rows.length
      const data = result.rows.map(r => ({
        ...r.dataValues,
        content: r.dataValues.content,
        replyCount: r.dataValues.Replies.length,
        likeCount: r.dataValues.Likes.length
      }))

      Followship.findAndCountAll({
        raw: true,
        nest: true,
      }).then(result => {
        const followerCount = result.rows.filter(followerUser => followerUser.followerId === Number(req.params.id))
        const followingCount = result.rows.filter(followingUser => followingUser.followingId === Number(req.params.id))

        User.findByPk(req.params.id)
          .then(user => {
            const nameWordCount = user.dataValues.name.length
            const introWordCount = user.dataValues.introduction.length
            return res.render('self', {
              user: user.toJSON(),
              nameWordCount: nameWordCount,
              introWordCount: introWordCount,
              totalTweet: totalTweet,
              tweet: data,
              followerCount: followerCount.length,
              followingCount: followingCount.length
            })
          })
      })
    })
  },

  getUserReply: (req, res) => {
    const whereQuery = {}
    whereQuery.userId = Number(req.params.id)

    Reply.findAndCountAll({
      include: [
        { model: Tweet, include: [User] }
      ],
      where: whereQuery,
      order: [['createdAt', 'DESC']],
    }).then(result => {
      const data = result.rows.map(r => ({
        ...r.dataValues,
        content: r.dataValues.content,
        replyUserAccount: r.dataValues.Tweet.dataValues.User.account
      }))
      Tweet.findAndCountAll({
        where: whereQuery,
      }).then(result => {
        const totalTweet = result.rows.length

        Followship.findAndCountAll({
          raw: true,
          nest: true,
        }).then(result => {
          const followerCount = result.rows.filter(followerUser => followerUser.followerId === Number(req.params.id))
          const followingCount = result.rows.filter(followingUser => followingUser.followingId === Number(req.params.id))

          User.findByPk(req.params.id)
            .then(user => {
              return res.render('selfReply', {
                user: user.toJSON(),
                totalTweet: totalTweet,
                Reply: data,
                followerCount: followerCount.length,
                followingCount: followingCount.length
              })
            })
        })
      })
    })
  },

  getUserLike: (req, res) => {
    const whereQuery = {}
    whereQuery.userId = Number(req.params.id)

    Like.findAndCountAll({
      include: [
        { model: Tweet, include: [User, Reply, Like] }
      ],
      where: whereQuery,
      order: [['createdAt', 'DESC']],
    }).then(result => {
      const data = result.rows.map(r => ({
        ...r.dataValues,
        content: r.dataValues.Tweet.dataValues.content,
        createdAt: r.dataValues.Tweet.dataValues.creatAt,
        likeAvatar: r.dataValues.Tweet.dataValues.User.avatar,
        likeUserName: r.dataValues.Tweet.dataValues.User.name,
        likeUserAccount: r.dataValues.Tweet.dataValues.User.account,
        replyCount: r.dataValues.Tweet.dataValues.Replies.length,
        likeCount: r.dataValues.Tweet.dataValues.Likes.length
      }))
      Tweet.findAndCountAll({
        where: whereQuery,
      }).then(result => {
        const totalTweet = result.rows.length

        Followship.findAndCountAll({
          raw: true,
          nest: true,
        }).then(result => {
          const followerCount = result.rows.filter(followerUser => followerUser.followerId === Number(req.params.id))
          const followingCount = result.rows.filter(followingUser => followingUser.followingId === Number(req.params.id))

          User.findByPk(req.params.id)
            .then(user => {
              return res.render('selfLike', {
                user: user.toJSON(),
                totalTweet: totalTweet,
                Like: data,
                followerCount: followerCount.length,
                followingCount: followingCount.length
              })
            })
        })
      })
    })
  },

  putUserEdit: (req, res) => {
    const { files } = req
    const imgurUploadLink = []

    if (files) {
      const getUploadLink = new Promise((resolve, reject) => {
        const fileTempPath = []
        fileTempPath.push(files.avatar[0].path, files.cover[0].path)
        fileTempPath.forEach(link => {
          imgur.setClientID(IMGUR_CLIENT_ID)
          imgur.upload(link, (err, img) => {
            console.log('inside:', img.data.link)
            imgurUploadLink.push(img.data.link)
          })
        })
        console.log('outside:', imgurUploadLink)
        return resolve(imgurUploadLink)
      })

      async function editedUploadLink() {
        try {
          const imgurUploadLinkFinal = await getUploadLink
          console.log('await:', imgurUploadLinkFinal)
          return imgurUploadLinkFinal
        } catch (err) {
          console.warn(err)
        }
      }
      User.findByPk(req.params.id)
        .then(user => {
          const uploadImg = editedUploadLink()
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: uploadImg[0],
            cover: uploadImg[1]
          }).then(user => {
            req.flash('success_messages', 'profile was successfully to update')
            res.redirect(`/users/self/${user.id}`)
          })
        })
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            cover: user.cover,
            avatar: user.avatar
          }).then(user => {
            req.flash('success_messages', 'profile was successfully to update')
            res.redirect(`/users/self/${user.id}`)
          })
        })
    }
  },

  getUserSetting: (req, res) => {
    const id = req.user.id

    User.findByPk(id)
      .then(user => {
        return res.render('setting', {
          layout: 'settingMain',
          user: user.toJSON()
        })
      })
  },

  putUserSetting: (req, res) => {
    const { account, name, email, password } = req.body
    User.findByPk(req.params.id)
      .then(user => {
        user.update({
          account,
          name,
          email,
          password
        }).then(user => {
          return res.redirect(`/users/self/${user.id}`)
        })
      })
  }
}

module.exports = userController