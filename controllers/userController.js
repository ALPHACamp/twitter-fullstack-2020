const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID


const userController = {
  getSignup: (req, res) => {
    return res.render('signup', { layout: 'userMain' })
  },

  postSignup: (req, res) => {
    if (req.body.password !== req.body.checkPassword) {
      req.flash('error_messages', '兩次密碼輸入不符！')
      res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '此信箱已註冊過！')
            res.redirect('/signup')
          } else {
            User.create({
              account: req.body.account,
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              req.flash('success_messages', '註冊成功！')
              return res.redirect('/signin')
            })
          }
        })
    }
  },

  getLogin: (req, res) => {
    return res.render('userLogin', { layout: 'userMain' })
  },

  postLogin: (req, res) => {
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    if (res.locals.user.id !== Number(req.params.id)) {
      req.flash('error_messages', "you can't enter other's profile!")
      return res.redirect('back')
    }
    const whereQuery = {}
    whereQuery.userId = res.locals.user.id

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
        description: r.dataValues.description,
        replyCount: r.dataValues.Replies.length,
        likeCount: r.dataValues.Likes.length,
        isLiked: req.user.LikedTweets.map(d => d.id).includes(r.id)
      }))

      Followship.findAndCountAll({
        raw: true,
        nest: true,
      }).then(result => {
        const followerCount = result.rows.filter(followerUser => followerUser.followerId === res.locals.user.id)
        const followingCount = result.rows.filter(followingUser => followingUser.followingId === res.locals.user.id)

        User.findByPk(res.locals.user.id)
          .then(user => {
            const nameWordCount = user.dataValues.name.length
            const introWordCount = user.dataValues.introduction.length
            res.status(200)
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
    let loginUser = false
    if (res.locals.user.id !== Number(req.params.id)) {
      loginUser = false
    } else {
      loginUser = true
    }

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
        comment: r.dataValues.comment,
        replyTweetId: r.dataValues.Tweet.id,
        replyUserId: r.dataValues.Tweet.dataValues.User.id,
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
              const nameWordCount = user.dataValues.name.length
              const introWordCount = user.dataValues.introduction.length
              return res.render('selfReply', {
                user: user.toJSON(),
                nameWordCount: nameWordCount,
                introWordCount: introWordCount,
                totalTweet: totalTweet,
                Reply: data,
                followerCount: followerCount.length,
                followingCount: followingCount.length,
                isLoginUser: loginUser
              })
            })
        })
      })
    })
  },

  getUserLike: (req, res) => {
    let loginUser = false
    if (res.locals.user.id !== Number(req.params.id)) {
      loginUser = false
    } else {
      loginUser = true
    }

    const whereQuery = {}
    whereQuery.userId = Number(req.params.id)

    Like.findAndCountAll({
      include: [
        { model: Tweet, include: [User, Reply, Like] }
      ],
      where: whereQuery,
      order: [['createdAt', 'DESC']],
    }).then(result => {
      console.log(result.rows[0].id)
      const data = result.rows.map(r => ({
        ...r.dataValues,
        tweetId: r.dataValues.Tweet.dataValues.id,
        description: r.dataValues.Tweet.dataValues.description,
        createdAt: r.dataValues.createdAt,
        likeUserId: r.dataValues.Tweet.dataValues.User.id,
        isLiked: req.user.LikedTweets.map(d => d.id).includes(r.id),
        likeAvatar: r.dataValues.Tweet.dataValues.User.avatar,
        likeUserName: r.dataValues.Tweet.dataValues.User.name,
        likeUserAccount: r.dataValues.Tweet.dataValues.User.account,
        replyCount: r.dataValues.Tweet.dataValues.Replies.length,
        likeCount: r.dataValues.Tweet.dataValues.Likes.length
      }))
      console.log(data)
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
              const nameWordCount = user.dataValues.name.length
              const introWordCount = user.dataValues.introduction.length
              return res.render('selfLike', {
                user: user.toJSON(),
                nameWordCount: nameWordCount,
                introWordCount: introWordCount,
                totalTweet: totalTweet,
                Like: data,
                followerCount: followerCount.length,
                followingCount: followingCount.length,
                isLoginUser: loginUser
              })
            })
        })
      })
    })
  },

  putUserEdit: (req, res) => {
    if (res.locals.user.id !== Number(req.params.id)) {
      req.flash('error_messages', "you can't enter other's profile!")
      return res.redirect('back')
    }

    const { files } = req
    const fileCountsArr = Object.keys(files)
    const fileCounts = fileCountsArr.length

    const getUploadLink = (link) => {
      return new Promise((resolve, reject) => {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(link, (err, img) => {
          return resolve(img.data.link)
        })
      })
    }

    if (fileCounts > 0) {
      const tempLink = []
      let image = ''
      if (files.avatar) {
        tempLink.push(files.avatar[0].path)
        image = 'avatar'
        editedUploadLink(tempLink, image)
      } else if (files.cover) {
        tempLink.push(files.cover[0].path)
        image = 'cover'
        editedUploadLink(tempLink, image)
      } else {
        tempLink.push(files.avatar[0].path, files.cover[0].path)
        image = 'both'
        editedUploadLink(tempLink, image)
      }

      async function editedUploadLink(tempLink, image) {
        try {
          const uploadImgs = await Promise.all(tempLink.map(async (link) => {
            const result = await getUploadLink(link)
            return result
          }))
          if (image === 'both') {
            User.findByPk(req.params.id)
              .then(user => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  avatar: uploadImgs[0],
                  cover: uploadImgs[1]
                }).then(user => {
                  req.flash('success_messages', 'profile was successfully to update')
                  res.redirect(`/users/self/${user.id}`)
                })
              })
          } else if (image === 'avatar') {
            User.findByPk(req.params.id)
              .then(user => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  avatar: uploadImgs[0],
                  cover: user.cover
                }).then(user => {
                  req.flash('success_messages', 'profile was successfully to update')
                  res.redirect(`/users/self/${user.id}`)
                })
              })
          } else if (image === 'cover') {
            User.findByPk(req.params.id)
              .then(user => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  avatar: user.avatar,
                  cover: uploadImgs[0]
                }).then(user => {
                  req.flash('success_messages', 'profile was successfully to update')
                  res.redirect(`/users/self/${user.id}`)
                })
              })
          }
        } catch (err) {
          console.warn(err)
        }
      }
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

  getUserFollower: (req, res) => {
    return Followship.findAll({
      raw: true,
      nest: true,
      where: { followingId: req.user.id },
      oder: ['createdAt', 'DESC']
    }).then(followships => {
      const followerUsers = []
      followships.forEach(followship => {
        if (followship.followerId) {
          followerUsers.push(followship.followerId)
        }
      })

      // get user's following
      Followship.findAll({
        raw: true,
        nest: true,
        where: { followerId: req.user.id }
      }).then(data => {
        const followingUsers = []
        data.forEach(d => {
          followingUsers.push(d.followingId)
        })
        // get user follower's tweets
        Tweet.findAll({
          raw: true,
          nest: true,
          include: [User]
        }).then(data => {
          const tweets = []
          data.forEach(d => {
            if (followerUsers.includes(d.UserId)) {
              tweets.push(d)
            }
          })
          tweetsData = tweets.map(tweet => ({
            ...tweet,
            isMainUserFollowing: followingUsers.includes(tweet.UserId)
          }))
          return res.render('selfFollower', { tweetsData })
        })
      })
    })
  },

  getUserFollowing: (req, res) => {
    return Followship.findAll({
      raw: true,
      nest: true,
      where: { followerId: req.user.id },
      oder: ['createdAt', 'DESC']
    }).then(followships => {
      const followingUsers = []
      followships.forEach(followship => {
        if (followship.followingId) {
          followingUsers.push(followship.followingId)
        }
      })

      Tweet.findAll({
        raw: true,
        nest: true,
        include: [User]
      }).then(data => {
        const tweets = []
        data.forEach(d => {
          if (followingUsers.includes(d.UserId)) {
            tweets.push(d)
          }
        })
        return res.render('selfFollowing', { tweets })
      })
    })
  },

  getOtherUser: (req, res) => {
    let loginUser = false
    if (res.locals.user.id !== Number(req.params.id)) {
      loginUser = false
    } else {
      loginUser = true
    }

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
        description: r.dataValues.description,
        replyCount: r.dataValues.Replies.length,
        likeCount: r.dataValues.Likes.length,
        isLiked: req.user.LikedTweets.map(d => d.id).includes(r.id)
      }))

      Followship.findAndCountAll({
        raw: true,
        nest: true,
      }).then(result => {
        const followerCount = result.rows.filter(followerUser => followerUser.followerId === Number(req.params.id))
        const followingCount = result.rows.filter(followingUser => followingUser.followingId === Number(req.params.id))

        User.findByPk(req.params.id)
          .then(user => {
            return res.render('other', {
              otherUser: user.toJSON(),
              totalTweet: totalTweet,
              tweet: data,
              followerCount: followerCount.length,
              followingCount: followingCount.length,
              isLoginUser: loginUser
            })
          })
      })
    })
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
  },

}

module.exports = userController